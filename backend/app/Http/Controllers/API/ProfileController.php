<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'address' => 'required|string',
            'current_password' => 'nullable|required_with:password',
            'password' => 'nullable|min:8|confirmed',
        ]);
        
        // Check if the current password is correct
        if (isset($validated['current_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                    'errors' => [
                        'current_password' => ['The provided current password is incorrect.']
                    ]
                ], 422);
            }
        }
        
        // Update basic profile information
        $user->name = $validated['name'];
        $user->phone_number = $validated['phone_number'];
        $user->address = $validated['address'];
        
        // Update password if provided
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();
        
        return response()->json($user);
    }
    
    /**
     * Upload and update user profile image
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png|max:2048', // max 2MB
        ]);
        
        $user = auth()->user();
        
        // Delete the old profile image if it exists
        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }
        
        // Store the new image
        $path = $request->file('profile_image')->store('profile-images/' . $user->id, 'public');
        
        // Update user record with the new image path
        $user->profile_image = $path;
        $user->save();
        
        return response()->json([
            'message' => 'Profile image updated successfully',
            'profile_image' => Storage::url($path),
            'user' => $user
        ]);
    }
    
    /**
     * Get the user's notification preferences
     */
    public function getNotificationPreferences()
    {
        $user = auth()->user();
        
        // Default preferences if none exist
        $defaultPreferences = [
            'email_notifications' => true,
            'push_notifications' => true,
            'delivery_updates' => true,
            'promotions' => false,
            'account_updates' => true,
        ];
        
        // Return user preferences or defaults if none exist
        return response()->json($user->notification_preferences ?? $defaultPreferences);
    }
    
    /**
     * Update the user's notification preferences
     */
    public function updateNotificationPreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_notifications' => 'required|boolean',
            'push_notifications' => 'required|boolean',
            'delivery_updates' => 'required|boolean',
            'promotions' => 'required|boolean',
            'account_updates' => 'required|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $user = auth()->user();
        
        // Update the user's notification preferences
        $user->notification_preferences = $request->all();
        $user->save();
        
        return response()->json([
            'message' => 'Notification preferences updated successfully',
            'preferences' => $user->notification_preferences
        ]);
    }
}

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import NotificationPreferences from './NotificationPreferences';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'notifications'

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
      setImageError(false); // Reset image error state
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
        current_password: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Could not load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!fileInputRef.current?.files[0]) {
      setError('Please select an image to upload');
      return;
    }

    setUploadingImage(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('profile_image', fileInputRef.current.files[0]);
      
      const response = await api.post('/user/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data.user);
      setImageError(false); // Reset image error state
      setSuccess('Profile image updated successfully');
      setImagePreview(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setError(error.response?.data?.message || 'Could not upload profile image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const updateData = {
        name: formData.name,
        phone_number: formData.phone_number,
        address: formData.address
      };
      
      // Only include password fields if the user is trying to change password
      if (formData.current_password && formData.password) {
        updateData.current_password = formData.current_password;
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await api.put('/user/profile', updateData);
      setUser(response.data);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        password_confirmation: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Could not update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          <div className="profile-image">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile Preview"
                onError={() => setImagePreview(null)}
              />
            ) : (user?.profile_image && !imageError) ? (
              <img 
                src={user.profile_image} 
                alt={user.name}
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            ) : (
              <div className="profile-initials">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="profile-image-upload">
            <input
              type="file"
              id="profile_image"
              accept="image/jpeg, image/png"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="file-input"
            />

          </div>
        </div>
        <div className="profile-title">
          <h2>My Account</h2>
          {activeTab === 'profile' && !editMode && (
            <button 
              className="edit-profile-btn" 
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </button>


      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

        <div className="profile-content">
          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (cannot be changed)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="password-section">
                <h3>Change Password</h3>
                <p className="section-description">
                  Leave blank if you don't want to change your password
                </p>

                <div className="form-group">
                  <label htmlFor="current_password">Current Password</label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_confirmation">Confirm New Password</label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    minLength="8"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditMode(false);
                    // Reset form data to current user data
                    setFormData({
                      name: user.name,
                      email: user.email,
                      phone_number: user.phone_number || '',
                      address: user.address || '',
                      current_password: '',
                      password: '',
                      password_confirmation: ''
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <div className="info-label">Full Name</div>
                <div className="info-value">{user.name}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Email</div>
                <div className="info-value">{user.email}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Phone Number</div>
                <div className="info-value">{user.phone_number || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Address</div>
                <div className="info-value">{user.address || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <div className="info-label">Member Since</div>
                <div className="info-value">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

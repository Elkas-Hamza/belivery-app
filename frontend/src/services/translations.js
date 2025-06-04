// French translations for the application
const translations = {
  // Common terms
  common: {
    appName: "DeliveryApp",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    retry: "Réessayer",
    save: "Enregistrer",
    cancel: "Annuler",
    submit: "Soumettre",
    select: "Sélectionner",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    close: "Fermer",
    next: "Suivant",
    previous: "Précédent",
    back: "Retour",
    continue: "Continuer",
    search: "Rechercher",
    filter: "Filtrer",
    all: "Tous",
    none: "Aucun",
    or: "ou",
    and: "et",
    yes: "Oui",
    no: "Non",
    total: "Total",
  },

  // Footer
  footer: {
    support: {
      title: "Support",
      faq: "FAQ",
      tracking: "Suivi de colis",
      privacy: "Confidentialité",
      terms: "Conditions d'utilisation",
    },
    contact: {
      title: "Contactez-nous",
      phone: "+212 600 000000",
      email: "contact@deliveryapp.ma",
      address: "123 Rue Example, Casablanca, Maroc",
    },
    copyright: "Tous droits réservés.",
  },

  // Navigation
  nav: {
    home: "Accueil",
    dashboard: "Tableau de bord",
    profile: "Profil",
    deliveries: "Livraisons",
    createDelivery: "Créer une livraison",
    tracking: "Suivi",
    pricing: "Tarification",
    about: "À propos",
    contact: "Contact",
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
  },

  // Authentication
  auth: {
    login: "Connexion",
    register: "Inscription",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    forgotPassword: "Mot de passe oublié ?",
    resetPassword: "Réinitialiser le mot de passe",
    name: "Nom",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    createAccount: "Créer un compte",
    loginToAccount: "Connectez-vous à votre compte",
    resetLink: "Lien de réinitialisation",
    passwordReset: "Réinitialisation du mot de passe",
    newPassword: "Nouveau mot de passe",
  },

  // Homepage
  home: {
    hero: {
      title: "Votre Monde en Mouvement",
      tagline: "Service de Livraison Rapide, Fiable et Sécurisé",
      description:
        "Votre partenaire de confiance pour des livraisons sûres et ponctuelles avec suivi en temps réel et délais de livraison garantis.",
      getQuote: "Obtenir un Devis Gratuit",
      learnMore: "En Savoir Plus",
    },
    stats: {
      deliveries: "Livraisons Complétées",
      onTime: "Livraison à Temps",
      support: "Support Client",
    },
    services: {
      title: "Nos Services de Livraison",
      subtitle: "Solutions de livraison adaptées à vos besoins",
      express: {
        title: "Livraison Express",
        description: "Livraisons le jour même pour les colis urgents",
        features: [
          "Livraison sous 2-4 heures",
          "Suivi GPS en temps réel",
          "Preuve de livraison",
        ],
        price: "À partir de",
        select: "Sélectionner",
      },
      standard: {
        title: "Livraison Standard",
        description: "Livraison fiable pour les colis réguliers",
        features: [
          "Livraison le lendemain",
          "Protection de colis jusqu'à 5000 DH",
          "Notifications de livraison",
        ],
        popular: "Le Plus Populaire",
        price: "À partir de",
        quote: "Obtenir un Devis",
      },
      economy: {
        title: "Livraison Économique",
        description: "Solution économique pour les articles non urgents",
        features: [
          "2-3 jours ouvrables",
          "Suivi en ligne",
          "Notifications par email",
        ],
        price: "À partir de",
        select: "Sélectionner",
      },
    },
    features: {
      title: "Caractéristiques Principales",
      subtitle: "Ce qui distingue notre service de livraison",
      timely: {
        title: "Livraison Ponctuelle",
        description:
          "98% de taux de livraison à l'heure avec des créneaux de livraison garantis",
      },
      coverage: {
        title: "Large Couverture",
        description: "Réseau étendu couvrant toute la zone métropolitaine",
      },
      secure: {
        title: "Manipulation Sécurisée",
        description:
          "Personnel formé professionnellement avec un équipement adapté à chaque type de colis",
      },
      satisfaction: {
        title: "Garantie de Satisfaction",
        description:
          "Garantie de remboursement à 100% si nous ne respectons pas notre promesse de livraison",
      },
    },
    process: {
      title: "Processus de Livraison en 4 Étapes",
      subtitle: "Expérience d'expédition rapide, efficace et sans tracas",
      book: {
        title: "Réservez Votre Livraison",
        description:
          "Saisissez les détails de collecte et de livraison, sélectionnez le type de service et obtenez un devis instantané",
        button: "Commencer",
      },
      pickup: {
        title: "Collecte Professionnelle",
        description:
          "Notre partenaire de livraison vérifié arrive à votre emplacement dans la fenêtre horaire prévue",
      },
      tracking: {
        title: "Suivi en Temps Réel",
        description:
          "Suivez le parcours de votre colis avec le suivi GPS et recevez des mises à jour automatiques de statut",
        button: "Essayer la Démo de Suivi",
      },
      delivery: {
        title: "Livraison Sécurisée",
        description:
          "Le colis est livré au destinataire avec preuve photo et confirmation de livraison",
      },
    },
    coverage: {
      title: "Notre Zone de Service",
      subtitle: "Livraison fiable dans toute la zone métropolitaine",
      zones: {
        a: {
          title: "Zone A - Centre-Ville",
          express: "Livraison Express : 1-2 heures",
          standard: "Livraison Standard : Même jour",
        },
        b: {
          title: "Zone B - Banlieues Intérieures",
          express: "Livraison Express : 2-3 heures",
          standard: "Livraison Standard : Même jour",
        },
        c: {
          title: "Zone C - Banlieues Extérieures",
          express: "Livraison Express : 3-4 heures",
          standard: "Livraison Standard : Jour suivant",
        },
      },
    },
    testimonials: {
      title: "Approuvé par les Entreprises et les Particuliers",
      subtitle:
        "Rejoignez des milliers de clients satisfaits qui font confiance à notre service de livraison",
      featured: "Mis en Avant",
    },
  },

  // Dashboard
  dashboard: {
    title: "Tableau de Bord",
    subtitle: "Suivez et gérez vos livraisons en un seul endroit",
    refresh: "Actualiser",
    newDelivery: "Nouvelle Livraison",
    stats: {
      total: "Livraisons Totales",
      pending: "En Attente",
      inProgress: "En Cours",
      delivered: "Livrées",
      cancelled: "Annulées",
    },
    analytics: {
      title: "Analyse des Livraisons",
      timeframe: "Derniers 30 jours",
      totalSpent: "Total Dépensé",
      avgDeliveryTime: "Temps Moyen de Livraison",
      timeUnit: "heures",
      mostCommonDestination: "Destination la Plus Courante",
      totalSpentDesc: "Montant total dépensé en livraisons",
      avgTimeDesc: "Temps moyen entre la commande et la livraison",
      destinationDesc: "Votre lieu de livraison le plus fréquent",
    },
    recentDeliveries: {
      title: "Livraisons Récentes",
      viewAll: "Voir tout",
      empty: {
        title: "Pas encore de livraisons",
        description:
          "Créez votre première demande de livraison pour commencer !",
        button: "Créer une Livraison",
      },
      pickup: "Collecte",
      delivery: "Livraison",
      track: "Suivre la Livraison",
    },
    status: {
      pending: "En Attente",
      in_progress: "En Cours",
      delivered: "Livrée",
      cancelled: "Annulée",
    },
  },

  // Delivery Form
  deliveryForm: {
    title: "Créer une Nouvelle Livraison",
    pickup: {
      title: "Détails de Collecte",
      address: "Adresse",
      addressPlaceholder: "Rue Mohammed V, No. 45",
      city: "Ville",
      cityPlaceholder: "Sélectionner une ville",
      postalCode: "Code Postal",
      postalCodePlaceholder: "20000",
    },
    delivery: {
      title: "Détails de Livraison",
      address: "Adresse",
      addressPlaceholder: "Avenue Hassan II, No. 23",
      city: "Ville",
      cityPlaceholder: "Sélectionner une ville",
      postalCode: "Code Postal",
      postalCodePlaceholder: "10000",
    },
    contact: {
      title: "Informations de Contact",
      number: "Numéro de Téléphone",
      numberPlaceholder: "+212 6XX XX XX XX",
    },
    package: {
      title: "Détails du Colis",
      weight: "Poids (kg)",
      weightPlaceholder: "Ex: 2.5",
      notes: "Notes",
      notesPlaceholder:
        "Instructions spéciales ou informations supplémentaires",
    },
    price: {
      title: "Détails du Prix",
      calculating: "Calcul en cours...",
      breakdown: "Détail du Prix",
      basePrice: "Prix de base",
      weightPrice: "Prix du poids",
      distancePrice: "Prix de la distance",
      totalPrice: "Prix Total",
      distance: "Distance de",
      to: "à",
      estimatedTime: "Temps de livraison estimé",
      hours: "heures",
    },
    submit: "Créer Livraison",
    submitSuccess: "Livraison créée avec succès",
    submitError: "Erreur lors de la création de la livraison",
  },

  // Tracking
  tracking: {
    title: "Suivi de Livraison",
    enterCode: "Entrez votre code de suivi",
    track: "Suivre",
    status: {
      pending: "En Attente de Collecte",
      in_progress: "En Transit",
      delivered: "Livré",
      cancelled: "Annulé",
    },
    details: {
      title: "Détails de la Livraison",
      pickupAddress: "Adresse de Collecte",
      deliveryAddress: "Adresse de Livraison",
      status: "Statut",
      createdAt: "Créé le",
      updatedAt: "Mis à jour le",
      weight: "Poids",
      price: "Prix",
    },
    timeline: {
      title: "Chronologie de la Livraison",
      created: "Commande Créée",
      pickedUp: "Colis Collecté",
      inTransit: "En Transit",
      delivered: "Livré",
      cancelled: "Annulé",
    },
    notFound: "Livraison non trouvée",
  },

  // Profile
  profile: {
    title: "Profil",
    personalInfo: "Informations Personnelles",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    updateProfile: "Mettre à Jour le Profil",
    changePassword: "Changer le Mot de Passe",
    currentPassword: "Mot de Passe Actuel",
    newPassword: "Nouveau Mot de Passe",
    confirmNewPassword: "Confirmer le Nouveau Mot de Passe",
    profileImage: "Image de Profil",
    uploadImage: "Télécharger une Image",
    removeImage: "Supprimer l'Image",
    notificationPreferences: "Préférences de Notification",
    deliveryUpdates: "Mises à Jour de Livraison",
    accountChanges: "Changements de Compte",
    promotions: "Promotions et Offres",
    emailNotifications: "Notifications par Email",
    pushNotifications: "Notifications Push",
    smsNotifications: "Notifications SMS",
    tabs: {
      profile: "Profil",
      notifications: "Notifications",
      security: "Sécurité",
    },
  },
};

export default translations;

import { ObjectId } from 'mongodb';

export interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    weeklyDigest: boolean;
    sitemapUpdates: boolean;
    securityAlerts: boolean;
  };
  preferences: {
    defaultChangeFreq: string;
    defaultPriority: string;
    darkMode: boolean;
    language: string;
    timezone: string;
    dateFormat: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
  };
}

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  company?: string;
  role?: string;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {
  _id: ObjectId;
}

export const sanitizeUser = (user: User): UserWithoutPassword => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser as UserWithoutPassword;
};

export const defaultUserSettings: UserSettings = {
  notifications: {
    email: true,
    browser: true,
    weeklyDigest: true,
    sitemapUpdates: true,
    securityAlerts: true
  },
  preferences: {
    defaultChangeFreq: 'weekly',
    defaultPriority: '0.8',
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD'
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date()
  }
}; 
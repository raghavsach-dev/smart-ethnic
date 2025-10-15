'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  pinCode?: string;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  sendOTP: (email: string) => Promise<{ exists: boolean }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; needsSignup?: boolean }>;
  completeSignup: (email: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get users from localStorage
const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('smartEthnicDemoUsers');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing stored users:', error);
    return [];
  }
};

// Helper function to save users to localStorage
const saveUsersToStorage = (users: User[]) => {
  localStorage.setItem('smartEthnicDemoUsers', JSON.stringify(users));
};

// Helper function to check if user exists by email
const checkUserExists = async (email: string): Promise<boolean> => {
  const users = getStoredUsers();
  return users.some(user => user.email === email);
};

// Helper function to check if phone number is already in use
const checkPhoneExists = async (phone: string): Promise<boolean> => {
  const users = getStoredUsers();
  return users.some(user => user.phone === phone);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedDemoUser = localStorage.getItem('smartEthnicDemoUser');
    if (savedDemoUser) {
      try {
        const demoUser = JSON.parse(savedDemoUser);
        setUser(demoUser);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('smartEthnicDemoUser');
      }
    }
    setLoading(false);
  }, []);

  // OTP-based authentication functions
  const sendOTP = async (email: string): Promise<{ exists: boolean }> => {
    try {
      // Simulate API delay for OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in localStorage
      const exists = await checkUserExists(email);
      return { exists };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; needsSignup?: boolean }> => {
    try {
      // Simulate API delay for OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate OTP format
      if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
      }

      // For demo purposes, accept '123456' as valid OTP
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 for demo.');
      }

      const userExists = await checkUserExists(email);

      if (userExists) {
        // Existing user - log them in
        const users = getStoredUsers();
        const existingUser = users.find((u: User) => u.email === email);
        if (existingUser) {
          setUser(existingUser);
          localStorage.setItem('smartEthnicDemoUser', JSON.stringify(existingUser));
          return { success: true, needsSignup: false };
        }
      } else {
        // New user - proceed to signup
        return { success: true, needsSignup: true };
      }

      throw new Error('Unable to authenticate user');
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };

  const completeSignup = async (email: string, userData: Partial<User>) => {
    try {
      // Check if phone number is already in use
      if (userData.phone && await checkPhoneExists(userData.phone)) {
        throw new Error('This phone number is already registered with another account.');
      }

      // Create new user
      const newUser: User = {
        id: 'demo_' + Date.now(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: email,
        phone: userData.phone || '',
        address: userData.address || '',
        pinCode: userData.pinCode || '',
        createdAt: new Date(),
      };

      // Save to localStorage
      const users = getStoredUsers();
      const updatedUsers = [...users, newUser];
      saveUsersToStorage(updatedUsers);

      setUser(newUser);
      localStorage.setItem('smartEthnicDemoUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Complete signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('smartEthnicDemoUser');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update user in localStorage
      const users = getStoredUsers();
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, ...userData } : u
      );
      saveUsersToStorage(updatedUsers);

      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);

      // Update localStorage
      localStorage.setItem('smartEthnicDemoUser', JSON.stringify({ ...user, ...userData }));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    sendOTP,
    verifyOTP,
    completeSignup,
    logout,
    updateProfile: updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

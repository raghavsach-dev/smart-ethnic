'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Session persistence utilities
const SESSION_KEY = 'smartEthnicDemoUser';

const saveUserSession = (user: User) => {
  const userData = JSON.stringify(user);
  localStorage.setItem(SESSION_KEY, userData);
  sessionStorage.setItem(SESSION_KEY, userData);
};

const getUserSession = (): User | null => {
  try {
    // Check localStorage first (persistent)
    let userData = localStorage.getItem(SESSION_KEY);

    // Check sessionStorage if not found
    if (!userData) {
      userData = sessionStorage.getItem(SESSION_KEY);
    }

    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user session:', error);
    return null;
  }
};

const clearUserSession = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

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

// Helper function to check if phone number is already in use
const checkPhoneExists = async (phone: string): Promise<boolean> => {
  const users = getStoredUsers();
  return users.some(user => user.phone === phone);
};

// Firestore helper functions
const checkUserExistsInFirestore = async (email: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error checking user in Firestore:', error);
    return false;
  }
};

const getUserFromFirestore = async (email: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: userData.id || email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || email,
        phone: userData.phone || '',
        address: userData.address || '',
        pinCode: userData.pinCode || '',
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return null;
  }
};

const saveUserToFirestore = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.email);

    // Handle createdAt - ensure it's a valid ISO string
    let createdAtIso: string;
    if (user.createdAt) {
      if (typeof user.createdAt === 'string') {
        createdAtIso = user.createdAt;
      } else if (user.createdAt instanceof Date) {
        createdAtIso = user.createdAt.toISOString();
      } else {
        createdAtIso = new Date().toISOString();
      }
    } else {
      createdAtIso = new Date().toISOString();
    }

    await setDoc(userRef, {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      pinCode: user.pinCode,
      createdAt: createdAtIso,
    });
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session on app load
    const checkSavedUser = async () => {
      try {
        const savedUser = getUserSession();

        if (savedUser) {
          // Optional: Verify user still exists in Firestore (uncomment if needed)
          // const userExists = await checkUserExistsInFirestore(savedUser.email);
          // if (!userExists) {
          //   clearUserSession();
          //   return;
          // }

          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error restoring user session:', error);
        clearUserSession();
      }
    };

    checkSavedUser().finally(() => setLoading(false));
  }, []);

  // Authentication functions

  const verifyOTP = async (email: string, _otp: string): Promise<{ success: boolean; needsSignup?: boolean }> => {
    try {
      // Simulate API delay for authentication
      await new Promise(resolve => setTimeout(resolve, 500));

      // OTP validation is now handled in the component
      // Check user existence in Firestore
      const userExists = await checkUserExistsInFirestore(email);

      if (userExists) {
        // Existing user - get user data from Firestore and log them in
        const userData = await getUserFromFirestore(email);
        if (userData) {
          setUser(userData);
          saveUserSession(userData);
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
        id: 'user_' + Date.now(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: email,
        phone: userData.phone || '',
        address: userData.address || '',
        pinCode: userData.pinCode || '',
        createdAt: new Date(),
      };

      // Save to Firestore
      await saveUserToFirestore(newUser);

      // Save session and update state
      setUser(newUser);
      saveUserSession(newUser);
    } catch (error) {
      console.error('Complete signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    clearUserSession();
    // Note: Cart clearing is handled by CartContext when isLoggedIn becomes false
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update user in Firebase Firestore
      await saveUserToFirestore({ ...user, ...userData });

      // Update user in localStorage
      const users = getStoredUsers();
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, ...userData } : u
      );
      saveUsersToStorage(updatedUsers);

      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);

      // Update session persistence
      const updatedUser = { ...user, ...userData };
      saveUserSession(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    loading,
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

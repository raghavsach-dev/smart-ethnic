'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { user, isLoggedIn } = useAuth();

  // Helper functions for Firestore cart operations
  const saveCartToFirestore = async (items: CartItem[], userEmail: string) => {
    try {
      const cartRef = doc(db, 'users', userEmail, 'cart', 'items');
      if (items.length > 0) {
        await setDoc(cartRef, { items, updatedAt: new Date() });
      } else {
        await deleteDoc(cartRef);
      }
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
    }
  };

  const loadCartFromFirestore = async (userEmail: string): Promise<CartItem[]> => {
    try {
      const cartRef = doc(db, 'users', userEmail, 'cart', 'items');
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const data = cartSnap.data();
        console.log('Loaded cart from Firestore:', data.items);
        return data.items || [];
      } else {
        console.log('No cart found in Firestore for user:', userEmail);
      }
    } catch (error) {
      console.error('Error loading cart from Firestore:', error);
    }
    return [];
  };

  // Load cart from Firebase for logged-in users only
  useEffect(() => {
    const loadCart = async () => {
      console.log('Loading cart, isLoggedIn:', isLoggedIn, 'user:', user?.email);
      if (isLoggedIn && user?.email) {
        // Load from Firestore for logged-in users
        const firestoreCart = await loadCartFromFirestore(user.email);
        console.log('Setting cart items:', firestoreCart);
        setCartItems(firestoreCart);
        setIsCartLoaded(true);
        // Note: Price refreshing is handled separately to avoid clearing cart on refresh
      } else {
        // Clear cart for non-logged-in users
        console.log('Clearing cart for non-logged-in user');
        setCartItems([]);
        setIsCartLoaded(false); // Reset loaded flag when logging out
      }
    };

    loadCart();
  }, [isLoggedIn, user?.email]);

  // Save cart to Firebase whenever it changes (only for logged-in users and after cart is loaded)
  useEffect(() => {
    const saveCart = async () => {
      if (isLoggedIn && user?.email && isCartLoaded) {
        console.log('Saving cart to Firestore:', cartItems);
        // Save to Firestore for logged-in users
        await saveCartToFirestore(cartItems, user.email);
      }
      // Don't save to localStorage for non-logged-in users
    };

    // Only save if cart is loaded to prevent overwriting with empty cart
    if (isCartLoaded) {
      // Debounce saves to avoid too many Firestore writes
      const timeoutId = setTimeout(saveCart, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, isLoggedIn, user?.email, isCartLoaded]);


  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem =>
        cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    if (isLoggedIn && user?.email) {
      // Clear from Firestore
      try {
        const cartRef = doc(db, 'users', user.email, 'cart', 'items');
        await deleteDoc(cartRef);
      } catch (error) {
        console.error('Error clearing cart from Firestore:', error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

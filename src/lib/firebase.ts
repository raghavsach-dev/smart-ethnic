// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtQpPF37D7d6VbR44YzY2k2CQ8dQ9TYa0",
  authDomain: "smartethnic-118aa.firebaseapp.com",
  projectId: "smartethnic-118aa",
  storageBucket: "smartethnic-118aa.firebasestorage.app",
  messagingSenderId: "111485676783",
  appId: "1:111485676783:web:7f872fade5ea0c8352bf1a",
  measurementId: "G-KDSC8KSW6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
}

export { analytics };
export default app;

// Firestore functions for products
import { collection, getDocs, query, limit, orderBy, doc, getDoc } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  sizes: string;
  material?: string;
  collectionId?: string;
  discountPercent?: number;
  originalPrice?: number;
}

// Get all collections
export async function getCollections() {
  try {
    const collectionsRef = collection(db, 'collections');
    const collectionsSnapshot = await getDocs(collectionsRef);
    return collectionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

// Get products from a specific collection
export async function getProductsFromCollection(collectionId: string, maxProducts: number = 50) {
  try {
    const productsRef = collection(db, 'collections', collectionId, 'products');
    const q = query(productsRef, orderBy('name'), limit(maxProducts));
    const productsSnapshot = await getDocs(q);

    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      collectionId
    })) as Product[];
  } catch (error) {
    console.error(`Error fetching products from collection ${collectionId}:`, error);
    return [];
  }
}

// Get top products from all collections (first 10 total)
export async function getTopProducts(): Promise<Product[]> {
  try {
    const collections = await getCollections();
    const allProducts: Product[] = [];
    const maxPerCollection = 5; // Get 5 from each collection to ensure we have enough

    // Get products from each collection
    for (const collection of collections) {
      const products = await getProductsFromCollection(collection.id, maxPerCollection);
      allProducts.push(...products);

      // If we already have 10+ products, we can stop
      if (allProducts.length >= 10) break;
    }

    // Return first 10 products
    return allProducts.slice(0, 10);
  } catch (error) {
    console.error('Error fetching top products:', error);
    // Return empty array on error - component will show "No featured products"
    return [];
  }
}

// Get product by ID from any collection
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    console.log('Searching for product ID:', productId);
    const collections = await getCollections();
    console.log('Available collections:', collections.map(c => c.id));

    for (const collection of collections) {
      try {
        console.log(`Checking collection: ${collection.id} for product: ${productId}`);
        const productRef = doc(db, 'collections', collection.id, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          console.log('Found product in collection:', collection.id);
          return {
            id: productSnap.id,
            ...productSnap.data(),
            collectionId: collection.id
          } as Product;
        }
      } catch (error) {
        console.log(`Error checking collection ${collection.id}:`, error);
        // Continue to next collection
        continue;
      }
    }

    console.log('Product not found in any collection');
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}

// Test function to check if Firestore is working
export async function testFirestoreConnection() {
  try {
    const collections = await getCollections();
    console.log('Firestore connection successful. Collections found:', collections.length);
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
}

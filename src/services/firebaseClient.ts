import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Gracefully handle offline or unavailable backend
  }
}
testConnection();

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously
};

export async function saveUserProfileToFirestore(user: { 
  uid: string; 
  email?: string | null; 
  displayName?: string | null; 
  photoURL?: string | null;
  phone?: string | null;
  role?: string | null;
  isGuest?: boolean;
  expiresAt?: any;
  deviceType?: string | null;
}) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || (user.phone ? `guest_${user.phone}@guest.portfolio` : 'guest@portfolio.com'),
      displayName: user.displayName || (user.phone ? `Guest (${user.phone})` : 'Portfolio User'),
      photoURL: user.photoURL || '',
      phone: user.phone || '',
      role: user.role || (user.isGuest ? 'guest' : 'user'),
      isGuest: !!user.isGuest,
      deviceType: user.deviceType || 'unknown',
      expiresAt: user.expiresAt || null,
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log('[Firestore] User profile saved successfully:', user.uid);
  } catch (err) {
    console.error('[Firestore Error] Failed to save user profile:', err);
  }
}

export async function saveContactMessageToFirestore(data: {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject?: string;
  message: string;
}) {
  const docRef = await addDoc(collection(db, 'contacts'), {
    userId: data.userId || 'anonymous',
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone ? data.phone.trim() : '',
    organization: data.organization ? data.organization.trim() : '',
    subject: data.subject ? data.subject.trim() : '',
    message: data.message.trim(),
    createdAt: serverTimestamp()
  });
  console.log('[Firestore] Contact message stored successfully with ID:', docRef.id);
  return { success: true, id: docRef.id };
}

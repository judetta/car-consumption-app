import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);

/** Firebase app Firestore instance */
export const db = getFirestore(app);

/** Firebase app auth instance */
export const auth = getAuth(app);

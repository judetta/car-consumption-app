import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { Car } from '../shared/interfaces/car.interface';
import { Refuel } from '../shared/interfaces/refuel.interface';
import { store } from '../shared/store';
import { db } from './firebase';

type Collection = 'cars' | 'events';

/** Get all items from Firestore collection
 * 
 * @param col The collection to query items from
 * 
 * @returns A `promise` that resolves to a list of items
 */
export const getFromFirestore = async (col: Collection) => {
  const currentUser = store.getState().auth.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  if (currentUser) {
    const queryCol = collection(db, col);
    const q = query(queryCol, where('userId', '==', currentUser.uid));
    await getDocs(q).then(
      snapshot => {
        // eslint-disable-next-line
        snapshot.docs.map(doc => {
          result.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }
    );
  }
  return result;
};

/** Add a new `item` to Firestore
 * 
 * @param col Collection to add the `item` to
 * @param item Item to add to collection `col`
 * 
 * @returns A `promise` that resolves to the added `item`
 */
export const addToFirestore = async (col: Collection, item: Car | Refuel) => {
  const currentUser = store.getState().auth.user;
  if (currentUser) {
    const queryCol = collection(db, col);
    const docRef = await addDoc(queryCol, {...item, userId: currentUser.uid});
    item.id = docRef.id;
    return item;
  }
};

/** Remove an existing `item` from Firestore
 * 
 * @param col Collection to remove `item` from
 * @param item Item to remove from `col`
 */
export const removeFromFirestore = async (col: Collection, item: Car | Refuel) => {
  const docRef = doc(db, col, item.id);
  await deleteDoc(docRef);
};

/** Update an existing `item` in Firestore
 * 
 * @param col Collection to remove `item` from
 * @param item Item to remove from `col`
 */
export const updateInFirestore = async (col: Collection, item: Car | Refuel) => {
  const docRef = doc(db, col, item.id);
  await updateDoc(docRef, {...item});
};
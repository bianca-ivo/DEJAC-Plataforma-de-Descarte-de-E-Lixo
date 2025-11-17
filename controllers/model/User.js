import { db } from "../../firebase.js";

const usersCollection = db.collection('pontos');

export const getUserById = async (id) => {
  const userDoc = await usersCollection.doc(id).get();
  return userDoc.exists ? userDoc.data() : null;
};

export const addUser = async (userData) => {
  const newUserRef = await usersCollection.add(userData);
  return newUserRef.id;
};

export const updateUser = async (id, userData) => {
  await usersCollection.doc(id).update(userData);
};

export const deleteUser = async (id) => {
  await usersCollection.doc(id).delete();
};

export const getAllUsers = async () => {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

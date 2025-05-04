import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

// Récupérer toutes les annonces
export const getAds = async () => {
  try {
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    throw error;
  }
};

// Ajouter une nouvelle annonce
export const addAd = async (adData) => {
  try {
    const adsRef = collection(db, 'ads');
    const docRef = await addDoc(adsRef, {
      ...adData,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      status: 'active',
      isActive: true
    });
    return { id: docRef.id, ...adData };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'annonce:', error);
    throw error;
  }
};

// Mettre à jour une annonce
export const updateAd = async (adData) => {
  try {
    const adRef = doc(db, 'ads', adData.id);
    await updateDoc(adRef, {
      ...adData,
      updatedAt: new Date().toISOString()
    });
    return adData;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    throw error;
  }
}; 
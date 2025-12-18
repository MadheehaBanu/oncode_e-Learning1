import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

export const useFirestore = (collectionName, constraints = []) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName) return;

        setLoading(true);

        try {
            const collectionRef = collection(db, collectionName);
            // Apply constraints if any (where, orderBy, etc.)
            // Note: constraints should be an array of Firestore query constraints
            const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const documents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(documents);
                setLoading(false);
                setError(null);
            }, (err) => {
                console.error("Firestore Error:", err);
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error("Firestore Setup Error:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [collectionName, JSON.stringify(constraints)]); // Use JSON.stringify to compare array contents

    return { data, loading, error };
};

export const useDocument = (collectionName, docId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName || !docId) return;

        setLoading(true);

        const docRef = doc(db, collectionName, docId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setData({ id: docSnap.id, ...docSnap.data() });
                setError(null);
            } else {
                setError('Document not found');
                setData(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore Document Error:", err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [collectionName, docId]);

    return { data, loading, error };
};

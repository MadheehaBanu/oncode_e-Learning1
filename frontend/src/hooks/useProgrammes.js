import { useState, useEffect } from 'react';

export const useProgrammes = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const { db } = require('../firebase');
            const { collection, getDocs } = require('firebase/firestore');

            const fetchData = async () => {
                try {
                    setLoading(true);
                    const querySnapshot = await getDocs(collection(db, 'programmes'));
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setData(docs);
                } catch (err) {
                    console.warn('Error fetching programmes:', err.message);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } catch (err) {
            console.warn('Firebase not configured');
            setLoading(false);
        }
    }, []);

    return { data, loading, error };
};

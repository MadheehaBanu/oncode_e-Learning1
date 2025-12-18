import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export const useContent = () => {
    const [banners, setBanners] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [bannersLoading, setBannersLoading] = useState(true);
    const [facultiesLoading, setFacultiesLoading] = useState(true);
    const [bannersError, setBannersError] = useState(null);
    const [facultiesError, setFacultiesError] = useState(null);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setBannersLoading(true);
                // Use new banners collection
                const q = query(collection(db, 'banners'), orderBy('order', 'asc'));
                const querySnapshot = await getDocs(q);

                // Fallback if empty to catch any issues
                if (querySnapshot.empty) {
                    // Try fetching without sort if index missing
                    const unsorted = await getDocs(collection(db, 'banners'));
                    const docs = unsorted.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBanners(docs);
                } else {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setBanners(docs);
                }

            } catch (err) {
                console.error('Error fetching banners:', err);
                setBannersError(err.message);
            } finally {
                setBannersLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                setFacultiesLoading(true);
                const q = query(collection(db, 'faculties'), orderBy('order', 'asc'));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    const unsorted = await getDocs(collection(db, 'faculties'));
                    const docs = unsorted.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFaculties(docs);
                } else {
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setFaculties(docs);
                }
            } catch (err) {
                console.error('Error fetching faculties:', err);
                setFacultiesError(err.message);
            } finally {
                setFacultiesLoading(false);
            }
        };
        fetchFaculties();
    }, []);

    return {
        banners,
        bannersLoading,
        bannersError,
        faculties,
        facultiesLoading,
        facultiesError
    };
};

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const BannerTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);

  useEffect(() => {
    const test = async () => {
      try {
        // Test 1: Check if db is initialized
        if (!db) {
          setStatus('❌ Firebase DB not initialized');
          return;
        }
        setStatus('✅ Firebase DB initialized');

        // Test 2: Try to read existing banners
        const docRef = doc(db, 'siteContent', 'banners');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data());
          setStatus('✅ Read existing banners from Firestore');
        } else {
          setStatus('⚠️ No banners document found');
        }

        // Test 3: Try to write test data
        await setDoc(doc(db, 'siteContent', 'banners'), {
          banners: [
            { id: 1, title: 'Test Banner', subtitle: 'Test', buttonText: 'Click', image: '', order: 1 }
          ],
          lastUpdated: new Date()
        });
        setStatus('✅ Successfully wrote to Firestore');

      } catch (err) {
        setStatus(`❌ Error: ${err.message}`);
        console.error('Full error:', err);
      }
    };

    test();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Firebase Banner Test</h2>
      <div className="p-4 bg-gray-100 rounded mb-4">
        <p className="font-mono text-sm">{status}</p>
      </div>
      {data && (
        <div className="p-4 bg-blue-50 rounded">
          <p className="font-bold mb-2">Current Data:</p>
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BannerTest;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const FixAdmin = () => {
    const { currentUser } = useAuth();
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const makeAdmin = async () => {
        if (!currentUser) {
            setStatus('You must be logged in first.');
            return;
        }

        setLoading(true);
        setStatus('Updating role via Backend...');

        try {
            // Direct call to backend API to bypass Firestore rules
            const response = await fetch('http://localhost:5000/api/fix-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: currentUser.uid }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('Success! You are now an admin. Please logout and login again.');
            } else {
                throw new Error(data.error || 'Failed to update role');
            }
        } catch (error) {
            console.error("Error updating role:", error);
            setStatus(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Admin Role Fixer</h1>

            <div className="mb-4">
                <p><strong>Current User:</strong> {currentUser ? currentUser.email : 'Not logged in'}</p>
                <p><strong>Current Role:</strong> {currentUser?.role || 'undefined'}</p>
                <p><strong>UID:</strong> {currentUser?.uid}</p>
            </div>

            <button
                onClick={makeAdmin}
                disabled={loading || !currentUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Make Me Admin (Backend Force)'}
            </button>

            {status && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    {status}
                </div>
            )}
        </div>
    );
};

export default FixAdmin;

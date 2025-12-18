import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const ContactManagement = () => {
  const [form, setForm] = useState({
    email: 'support@oncode.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street\nSan Francisco, CA 94105'
  });

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const docRef = doc(db, 'settings', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      }
    } catch (error) {
      console.error('Firestore permission error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'contact'), form);
      alert('Contact information updated successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Information Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
            required
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Update Contact Information
        </button>
      </form>
    </div>
  );
};

export default ContactManagement;

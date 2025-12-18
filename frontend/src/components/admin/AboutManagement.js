import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AboutManagement = () => {
  const [form, setForm] = useState({
    mission: '',
    studentsCount: '50K+',
    coursesCount: '500+',
    instructorsCount: '100+',
    successRate: '95%'
  });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const docRef = doc(db, 'settings', 'about');
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
      await setDoc(doc(db, 'settings', 'about'), form);
      alert('About page updated successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">About Page Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Mission Statement</label>
          <textarea
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Students Enrolled</label>
            <input
              type="text"
              value={form.studentsCount}
              onChange={(e) => setForm({ ...form, studentsCount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Courses Available</label>
            <input
              type="text"
              value={form.coursesCount}
              onChange={(e) => setForm({ ...form, coursesCount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Expert Instructors</label>
            <input
              type="text"
              value={form.instructorsCount}
              onChange={(e) => setForm({ ...form, instructorsCount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Success Rate</label>
            <input
              type="text"
              value={form.successRate}
              onChange={(e) => setForm({ ...form, successRate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Update About Page
        </button>
      </form>
    </div>
  );
};

export default AboutManagement;

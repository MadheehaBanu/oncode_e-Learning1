import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'Academic', date: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'news'));
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Firestore permission error:', error);
      alert('Please update Firestore rules in Firebase Console to allow read/write access.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, 'news', editing), form);
        setEditing(null);
      } else {
        await addDoc(collection(db, 'news'), form);
      }
      setForm({ title: '', content: '', category: 'Academic', date: '' });
      alert('News saved successfully!');
      loadNews();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this news?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
        loadNews();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditing(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">News Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows="4"
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option>Academic</option>
          <option>Partnership</option>
          <option>Achievement</option>
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {editing ? 'Update' : 'Add'} News
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ title: '', content: '', category: 'Academic', date: '' }); }}
            className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {news.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.category} - {typeof item.date === 'string' ? item.date : item.date?.toDate?.()?.toLocaleDateString() || 'N/A'}</p>
            <p className="text-gray-700 mb-3">{item.content}</p>
            <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Edit</button>
            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManagement;

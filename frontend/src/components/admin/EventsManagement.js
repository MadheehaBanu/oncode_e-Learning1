import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Firestore permission error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateDoc(doc(db, 'events', editing), form);
        setEditing(null);
      } else {
        await addDoc(collection(db, 'events'), form);
      }
      setForm({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop' });
      alert('Event saved successfully!');
      loadEvents();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', id));
        loadEvents();
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
      <h2 className="text-2xl font-bold mb-6">Events Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Time (e.g., 2:00 PM - 5:00 PM)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="p-2 border rounded"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option>Workshop</option>
          <option>Career</option>
          <option>Networking</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {editing ? 'Update' : 'Add'} Event
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ title: '', description: '', date: '', time: '', location: '', type: 'Workshop' }); }}
            className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {events.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{item.type} - {typeof item.date === 'string' ? item.date : item.date?.toDate?.()?.toLocaleDateString() || 'N/A'} at {item.time}</p>
            <p className="text-gray-700 mb-1">{item.description}</p>
            <p className="text-gray-600 text-sm mb-3">📍 {item.location}</p>
            <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">Edit</button>
            <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManagement;

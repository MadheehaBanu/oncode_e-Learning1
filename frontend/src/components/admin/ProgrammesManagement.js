import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '../../utils/firebaseStorage';
import { useFirestore } from '../../hooks/useFirestore';

const ProgrammesManagement = () => {
  const { data: programmes, loading } = useFirestore('programmes');
  const [form, setForm] = useState({ title: '', description: '', category: '', duration: '', image: '' });
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'programmes');
      }

      const data = { title: form.title, description: form.description, category: form.category, duration: form.duration, image: imageUrl };

      if (editId) {
        await updateDoc(doc(db, 'programmes', editId), data);
      } else {
        await addDoc(collection(db, 'programmes'), data);
      }

      setForm({ title: '', description: '', category: '', duration: '', image: '' });
      setImageFile(null);
      setEditId(null);
    } catch (err) {
      console.error('Error saving programme:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (programme) => {
    setForm(programme);
    setEditId(programme.id);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Delete this programme?')) {
      try {
        await deleteDoc(doc(db, 'programmes', id));
        if (imageUrl) await deleteImage(imageUrl);
      } catch (err) {
        console.error('Error deleting programme:', err);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Programmes Management</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded">
        <input
          type="text"
          placeholder="Programme Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 6 weeks)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded mb-4"
          rows="3"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : editId ? 'Update Programme' : 'Add Programme'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({ title: '', description: '', category: '', duration: '', image: '' });
              setEditId(null);
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          programmes.map((prog) => (
            <div key={prog.id} className="border p-4 rounded">
              {prog.image && <img src={prog.image} alt={prog.title} className="w-full h-40 object-cover rounded mb-2" />}
              <h3 className="font-bold text-lg">{prog.title}</h3>
              <p className="text-sm text-gray-500">{prog.category} • {prog.duration}</p>
              <p className="text-sm text-gray-600 mb-3">{prog.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(prog)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prog.id, prog.image)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgrammesManagement;

import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '../../utils/firebaseStorage';
import { useFirestore } from '../../hooks/useFirestore';

const FacultyManagement = () => {
  const { data: faculties, loading } = useFirestore('faculties');
  const [form, setForm] = useState({ name: '', description: '', icon: '', image: '', order: 1 });
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'faculties');
      }

      const data = { ...form, image: imageUrl };

      if (editId) {
        await updateDoc(doc(db, 'faculties', editId), data);
      } else {
        await addDoc(collection(db, 'faculties'), data);
      }

      setForm({ name: '', description: '', icon: '', image: '', order: 1 });
      setImageFile(null);
      setEditId(null);
    } catch (err) {
      console.error('Error saving faculty:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (faculty) => {
    setForm(faculty);
    setEditId(faculty.id);
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Delete this faculty?')) {
      try {
        await deleteDoc(doc(db, 'faculties', id));
        if (imageUrl) await deleteImage(imageUrl);
      } catch (err) {
        console.error('Error deleting faculty:', err);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Faculty Management</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Faculty Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Icon (emoji)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="border p-2 rounded"
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            placeholder="Order"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : editId ? 'Update Faculty' : 'Add Faculty'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', description: '', icon: '', image: '', order: 1 });
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
          faculties.map((faculty) => (
            <div key={faculty.id} className="border p-4 rounded">
              {faculty.image && <img src={faculty.image} alt={faculty.name} className="w-full h-40 object-cover rounded mb-2" />}
              <h3 className="font-bold text-lg">{faculty.icon} {faculty.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{faculty.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(faculty)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faculty.id, faculty.image)}
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

export default FacultyManagement;

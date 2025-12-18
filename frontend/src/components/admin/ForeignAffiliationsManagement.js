import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '../../utils/firebaseStorage';
import { useFirestore } from '../../hooks/useFirestore';

const ForeignAffiliationsManagement = () => {
  const { data: affiliations, loading } = useFirestore('foreignAffiliations');
  const [form, setForm] = useState({ name: '', country: '', description: '', logo: '' });
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let logoUrl = form.logo;
      if (imageFile) {
        logoUrl = await uploadImage(imageFile, 'foreign-affiliations');
      }

      const data = { name: form.name, country: form.country, description: form.description, logo: logoUrl };

      if (editId) {
        await updateDoc(doc(db, 'foreignAffiliations', editId), data);
      } else {
        await addDoc(collection(db, 'foreignAffiliations'), data);
      }

      setForm({ name: '', country: '', description: '', logo: '' });
      setImageFile(null);
      setEditId(null);
    } catch (err) {
      console.error('Error saving affiliation:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (affiliation) => {
    setForm(affiliation);
    setEditId(affiliation.id);
  };

  const handleDelete = async (id, logoUrl) => {
    if (window.confirm('Delete this affiliation?')) {
      try {
        await deleteDoc(doc(db, 'foreignAffiliations', id));
        if (logoUrl) await deleteImage(logoUrl);
      } catch (err) {
        console.error('Error deleting affiliation:', err);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Foreign Affiliations</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
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
          {uploading ? 'Uploading...' : editId ? 'Update' : 'Add Affiliation'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', country: '', description: '', logo: '' });
              setEditId(null);
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          affiliations.map((aff) => (
            <div key={aff.id} className="border p-4 rounded text-center">
              {aff.logo && <img src={aff.logo} alt={aff.name} className="w-full h-32 object-contain rounded mb-2" />}
              <h3 className="font-bold">{aff.name}</h3>
              <p className="text-sm text-gray-500">{aff.country}</p>
              <p className="text-sm text-gray-600 mb-3">{aff.description}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(aff)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(aff.id, aff.logo)}
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

export default ForeignAffiliationsManagement;

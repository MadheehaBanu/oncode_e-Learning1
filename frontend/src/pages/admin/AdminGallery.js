import React, { useEffect, useState } from 'react';

const AdminGallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGalleryImages = () => {
    setLoading(true);
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGalleryImages(data.data);
        } else {
          setError('Failed to load gallery images');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load gallery images');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      setError('Image URL cannot be empty');
      return;
    }
    setError('');
    setLoading(true);
    fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: newImageUrl, caption: newCaption })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNewImageUrl('');
          setNewCaption('');
          fetchGalleryImages();
        } else {
          setError('Failed to add image');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to add image');
        setLoading(false);
      });
  };

  const handleDeleteImage = (id) => {
    setLoading(true);
    fetch(`/api/gallery/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchGalleryImages();
        } else {
          setError('Failed to delete image');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Failed to delete image');
        setLoading(false);
      });
  };

  return (
    <div className="admin-gallery-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Manage Gallery Images</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          style={{ width: '70%', marginRight: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          style={{ width: '25%', marginRight: '10px', padding: '8px' }}
        />
        <button disabled={loading} onClick={handleAddImage} style={{ padding: '8px 16px' }}>
          Add Image
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {galleryImages.map((img) => (
          <li key={img.id} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <img src={img.imageUrl} alt={img.caption || 'Gallery'} style={{ width: '120px', height: '80px', objectFit: 'cover', marginRight: '15px', borderRadius: '5px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0 }}>{img.caption || '-'}</p>
            </div>
            <button disabled={loading} onClick={() => handleDeleteImage(img.id)} style={{ color: 'red', cursor: 'pointer' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminGallery;

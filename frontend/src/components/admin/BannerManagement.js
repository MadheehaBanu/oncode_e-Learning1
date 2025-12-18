import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { uploadImage, deleteImage } from '../../utils/firebaseStorage';

const BannerManagement = () => {
  const [banners, setBanners] = useState([
    { id: 1, title: '', subtitle: '', buttonText: '', image: '', order: 1 },
    { id: 2, title: '', subtitle: '', buttonText: '', image: '', order: 2 },
    { id: 3, title: '', subtitle: '', buttonText: '', image: '', order: 3 }
  ]);
  const [imageFiles, setImageFiles] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'banners');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBanners(docSnap.data().banners || banners);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    fetchBanners();
  }, []);

  const handleBannerChange = (index, field, value) => {
    const updated = [...banners];
    updated[index][field] = value;
    setBanners(updated);
  };

  const handleImageChange = (index, file) => {
    setImageFiles({ ...imageFiles, [index]: file });
  };

  const handleAddBanner = () => {
    setBanners([
      ...banners,
      { id: Date.now(), title: '', subtitle: '', buttonText: '', image: '', order: banners.length + 1 }
    ]);
  };

  const handleRemoveBanner = (index) => {
    const updated = banners.filter((_, i) => i !== index);
    setBanners(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      console.log("Starting banner save...");
      const updatedBanners = await Promise.all(
        banners.map(async (banner, index) => {
          let imageUrl = banner.image;
          if (imageFiles[index]) {
            console.log(`Uploading image for banner ${index + 1}...`);
            try {
              imageUrl = await uploadImage(imageFiles[index], 'banners');
              console.log(`Image uploaded for banner ${index + 1}:`, imageUrl);
            } catch (imgErr) {
              console.error(`Failed to upload image for banner ${index + 1}:`, imgErr);
              // Include the actual error message for the user to see
              throw new Error(`Failed to upload image for Banner ${index + 1}: ${imgErr.message}`);
            }
          }
          return { ...banner, image: imageUrl };
        })
      );

      console.log("Saving banners to Firestore...", updatedBanners);
      await setDoc(doc(db, 'siteContent', 'banners'), { banners: updatedBanners });
      setImageFiles({});
      console.log('✅ Banners saved to Firestore successfully');
      alert('Banners updated successfully!');
    } catch (err) {
      console.error('❌ Error saving banners:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <button
          type="button"
          onClick={handleAddBanner}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Banner
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {banners.map((banner, index) => (
          <div key={index} className="mb-8 p-4 bg-gray-50 rounded border-2 border-gray-200 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Banner {index + 1}</h3>
              {banners.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBanner(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Title"
              value={banner.title}
              onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
              className="w-full border p-2 rounded mb-4"
              required
            />

            <textarea
              placeholder="Subtitle / Content"
              value={banner.subtitle}
              onChange={(e) => handleBannerChange(index, 'subtitle', e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="2"
              required
            />

            <input
              type="text"
              placeholder="Button Text (e.g., Learn More)"
              value={banner.buttonText}
              onChange={(e) => handleBannerChange(index, 'buttonText', e.target.value)}
              className="w-full border p-2 rounded mb-4"
              required
            />

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="w-full border p-2 rounded"
              />
              {banner.image && (
                <div className="mt-2">
                  <img src={banner.image} alt={`Banner ${index + 1}`} className="w-full h-40 object-cover rounded" />
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 font-bold"
        >
          {uploading ? 'Saving...' : 'Save All Banners'}
        </button>
      </form>
    </div>
  );
};

export default BannerManagement;

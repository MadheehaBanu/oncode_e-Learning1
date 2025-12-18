import React, { useState, useEffect } from 'react';

const ManageContent = () => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'course', 
    category: '',
    thumbnail: '',
    link: '',
    status: 'draft',
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('contents') || '[]');
    setContents(saved);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('contents', JSON.stringify(data));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'course',
      category: '',
      thumbnail: '',
      link: '',
      status: 'draft'
    });
    setEditingContent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updated;
    if (editingContent) {
      updated = contents.map(c => 
        c.id === editingContent.id ? { ...editingContent, ...formData } : c
      );
    } else {
      updated = [
        ...contents,
        { 
          id: Date.now(), 
          ...formData, 
          createdAt: new Date().toISOString() 
        }
      ];
    }

    setContents(updated);
    saveToStorage(updated);
    setShowModal(false);
    resetForm();
  };

  const filteredContent = contents.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || c.type === filterType;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Manage Content</h1>
          <p className="text-slate-600">Create, update, and organize platform content</p>
        </div>
        <button
          onClick={() => { setShowModal(true); resetForm(); }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700"
        >
          Add New Content
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />

          <select
            value={filterType}
            onChange={(e)=>setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Types</option>
            <option value="course">Courses</option>
            <option value="video">Videos</option>
            <option value="material">PDF / Material</option>
            <option value="blog">Blog Posts</option>
            <option value="announcement">Announcements</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs">Title</th>
                <th className="px-6 py-3 text-left text-xs">Type</th>
                <th className="px-6 py-3 text-left text-xs">Status</th>
                <th className="px-6 py-3 text-left text-xs">Created</th>
                <th className="px-6 py-3 text-left text-xs">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredContent.map((c)=>(
                <tr key={c.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4">{c.title}</td>
                  <td className="px-6 py-4 capitalize">{c.type}</td>
                  <td className="px-6 py-4 capitalize">{c.status}</td>
                  <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-4">
                    <button 
                      onClick={()=>{ setEditingContent(c); setFormData(c); setShowModal(true); }}
                      className="text-green-600"
                    >
                      Edit
                    </button>

                    <button 
                      onClick={()=>{
                        const updated = contents.filter(x=>x.id !== c.id);
                        setContents(updated);
                        saveToStorage(updated);
                      }}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingContent ? "Edit Content" : "Add Content"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input type="text" name="title" placeholder="Title"
                value={formData.title}
                onChange={(e)=>setFormData({...formData, title:e.target.value})}
                required className="w-full border px-4 py-2 rounded"
              />

              <textarea name="description" placeholder="Description"
                value={formData.description}
                onChange={(e)=>setFormData({...formData, description:e.target.value})}
                rows="3" className="w-full border px-4 py-2 rounded"
              />

              <select name="type"
                value={formData.type}
                onChange={(e)=>setFormData({...formData, type:e.target.value})}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="course">Course</option>
                <option value="video">Video</option>
                <option value="material">Material</option>
                <option value="blog">Blog</option>
                <option value="announcement">Announcement</option>
              </select>

              <input type="text" placeholder="Category"
                value={formData.category}
                onChange={(e)=>setFormData({...formData, category:e.target.value})}
                className="w-full border px-4 py-2 rounded"
              />

              <input type="text" placeholder="Thumbnail URL"
                value={formData.thumbnail}
                onChange={(e)=>setFormData({...formData, thumbnail:e.target.value})}
                className="w-full border px-4 py-2 rounded"
              />

              <input type="text" placeholder="Link / File URL"
                value={formData.link}
                onChange={(e)=>setFormData({...formData, link:e.target.value})}
                className="w-full border px-4 py-2 rounded"
              />

              <select value={formData.status}
                onChange={(e)=>setFormData({...formData, status:e.target.value})}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={()=>setShowModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  {editingContent ? "Update" : "Add"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageContent;

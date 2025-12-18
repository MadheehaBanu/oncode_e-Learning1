import React, { useState } from 'react';
import FacultyManagement from '../../components/admin/FacultyManagement';
import ProfessionalAffiliationsManagement from '../../components/admin/ProfessionalAffiliationsManagement';
import ForeignAffiliationsManagement from '../../components/admin/ForeignAffiliationsManagement';
import ProgrammesManagement from '../../components/admin/ProgrammesManagement';
import BannerManagement from '../../components/admin/BannerManagement';
import BannerTest from '../../components/admin/BannerTest';
import NewsManagement from '../../components/admin/NewsManagement';
import EventsManagement from '../../components/admin/EventsManagement';
import AboutManagement from '../../components/admin/AboutManagement';
import ContactManagement from '../../components/admin/ContactManagement';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('banners');

  const tabs = [
    { id: 'test', label: 'Firebase Test', component: BannerTest },
    { id: 'banners', label: 'Banners', component: BannerManagement },
    { id: 'news', label: 'News', component: NewsManagement },
    { id: 'events', label: 'Events', component: EventsManagement },
    { id: 'about', label: 'About Page', component: AboutManagement },
    { id: 'contact', label: 'Contact Info', component: ContactManagement },
    { id: 'faculties', label: 'Faculties', component: FacultyManagement },
    { id: 'professional', label: 'Professional Affiliations', component: ProfessionalAffiliationsManagement },
    { id: 'foreign', label: 'Foreign Affiliations', component: ForeignAffiliationsManagement },
    { id: 'programmes', label: 'Programmes', component: ProgrammesManagement }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Admin Settings</h1>
          <p className="text-blue-100 mt-2">Manage all dynamic content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AdminSettings;

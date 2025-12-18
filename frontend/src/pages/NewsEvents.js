import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    loadNewsEvents();
  }, []);

  const loadNewsEvents = async () => {
    try {
      const newsSnapshot = await getDocs(collection(db, 'news'));
      const newsItems = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewsData(newsItems.length > 0 ? newsItems : []);

      const eventsSnapshot = await getDocs(collection(db, 'events'));
      const eventsItems = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventsData(eventsItems.length > 0 ? eventsItems : []);
    } catch (error) {
      console.error('Error loading news/events:', error);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Partnership': return 'bg-green-100 text-green-800';
      case 'Achievement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Career': return 'bg-orange-100 text-orange-800';
      case 'Workshop': return 'bg-blue-100 text-blue-800';
      case 'Networking': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">News & Events</h1>
          <p className="text-gray-600 text-lg">Stay updated with the latest news and upcoming events at OnCode</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'news'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📰 Latest News
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📅 Upcoming Events
            </button>
          </div>
        </div>

        {/* News Section */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            {newsData.map(article => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl text-white">📰</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {typeof article.date === 'string' ? new Date(article.date).toLocaleDateString() : article.date?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{article.title}</h2>
                    <p className="text-gray-600 mb-4">{article.content}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events Section */}
        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsData.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <span className="text-2xl">📅</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>{typeof event.date === 'string' ? new Date(event.date).toLocaleDateString() : event.date?.toDate?.()?.toLocaleDateString() || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEvents;
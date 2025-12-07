import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import CreateArticleModal from '../components/CreateArticleModal';
import { Loader2, Plus } from 'lucide-react';

const Homepage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch articles from the backend
  const fetchArticles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/articles');
      setArticles(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load discussion feed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Discussion Feed</h1>
            <p className="text-slate-600 mt-1">Read the latest interview experiences and tech articles.</p>
          </div>
          
          {/* Create Post Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Loading posts...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        {/* Feed List */}
        {!loading && !error && (
          <div className="space-y-4">
            {articles.length > 0 ? (
              articles.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No posts yet</h3>
                <p className="text-slate-500 mt-1 mb-6">Be the first to share your experience!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                >
                  Create a discussion
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal for Creating New Articles */}
        <CreateArticleModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onArticleCreated={fetchArticles} // Refresh list after successful creation
        />

      </div>
    </div>
  );
};

export default Homepage;
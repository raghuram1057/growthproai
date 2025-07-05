import React, { useState } from 'react';
import { Search, Star, MessageCircle, Sparkles, MapPin, Building2, RefreshCw, TrendingUp } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regeneratingHeadline, setRegeneratingHeadline] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/business-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }

      const data = await response.json();
      setBusinessData(data);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Failed to fetch business data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateHeadline = async () => {
    if (!businessData) return;

    setRegeneratingHeadline(true);
    try {
      const response = await fetch(`/api/regenerate-headline?name=${encodeURIComponent(formData.name)}&location=${encodeURIComponent(formData.location)}`);
      
      if (!response.ok) {
        throw new Error('Failed to regenerate headline');
      }

      const data = await response.json();
      setBusinessData(prev => ({ ...prev, headline: data.headline }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRegeneratingHeadline(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GrowthProAI</h1>
              <p className="text-sm text-gray-600">Local Business Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Business Analysis</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-2" />
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your business name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your location"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Analyze Business</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        {businessData && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Business Overview</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{formData.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Rating Card */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Google Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{businessData.rating}</span>
                  <div className="flex space-x-1">
                    {renderStars(businessData.rating)}
                  </div>
                </div>
              </div>

              {/* Reviews Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Total Reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{businessData.reviews}</span>
                  <span className="text-sm text-gray-600">reviews</span>
                </div>
              </div>

              {/* Business Name Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">Business</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 truncate">{formData.name}</div>
              </div>
            </div>

            {/* SEO Headline Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h4 className="text-lg font-semibold text-gray-900">AI-Generated SEO Headline</h4>
                </div>
                <button
                  onClick={handleRegenerateHeadline}
                  disabled={regeneratingHeadline}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  <RefreshCw className={`w-4 h-4 ${regeneratingHeadline ? 'animate-spin' : ''}`} />
                  <span>{regeneratingHeadline ? 'Generating...' : 'Regenerate'}</span>
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-gray-900 text-lg leading-relaxed">{businessData.headline}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
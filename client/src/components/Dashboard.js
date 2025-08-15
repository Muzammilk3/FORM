import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, BarChart3, Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.');
        toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please check if MongoDB is connected.');
        toast.error('Server error. Please check if MongoDB is connected.');
      } else {
        setError('Failed to fetch forms. Please try again.');
        toast.error('Failed to fetch forms. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await axios.delete(`/api/forms/${id}`);
        toast.success('Form deleted successfully');
        fetchForms();
      } catch (error) {
        toast.error('Failed to delete form');
        console.error('Error deleting form:', error);
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/forms/${id}/publish`, {
        isPublished: !currentStatus
      });
      toast.success(`Form ${currentStatus ? 'unpublished' : 'published'} successfully`);
      fetchForms();
    } catch (error) {
      toast.error('Failed to update form status');
      console.error('Error updating form:', error);
    }
  };

  const copyPreviewLink = (id) => {
    const link = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(link);
    toast.success('Preview link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading forms...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your forms and view responses</p>
        </div>
        <Link
          to="/builder"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Create New Form</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={fetchForms} className="text-red-500 hover:text-red-700">
              Retry
            </button>
          </span>
        </div>
      )}

      {!error && forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-6">Create your first form to get started</p>
          <Link
            to="/builder"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your First Form
          </Link>
        </div>
      ) : !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.title}</h3>
                  {form.description && (
                    <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{form.questions.length} questions</span>
                    <span>•</span>
                    <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    form.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {form.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/builder/${form._id}`}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </Link>
                <Link
                  to={`/preview/${form._id}`}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </Link>
                <Link
                  to={`/responses/${form._id}`}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <BarChart3 size={14} />
                  <span>Responses</span>
                </Link>
                <button
                  onClick={() => copyPreviewLink(form._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  <Copy size={14} />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => togglePublish(form._id, form.isPublished)}
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    form.isPublished
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {form.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => deleteForm(form._id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;




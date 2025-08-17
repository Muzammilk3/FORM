
rm -r routes/upload.js uploads/import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const HeaderImageUpload = ({ currentImage, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.imageUrl) {
        onImageUpdate(response.data.imageUrl);
        toast.success('Header image uploaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error uploading header image:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload header image';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageUpdate('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Header Image
      </label>
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Header"
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="hidden"
            id="header-image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="header-image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ImageIcon size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload header image'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Recommended size: 1200x300px
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default HeaderImageUpload;





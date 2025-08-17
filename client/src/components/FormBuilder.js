import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../config/axios';
import toast from 'react-hot-toast';
import QuestionEditor from './QuestionEditor';
import HeaderImageUpload from './HeaderImageUpload';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    headerImage: '',
    questions: [],
    isPublished: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/forms/${id}`);
      setForm(response.data);
    } catch (error) {
      toast.error('Failed to fetch form');
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToNewQuestion = () => {
    // Wait for state update and DOM render
    setTimeout(() => {
      const questions = document.querySelectorAll('.question-card');
      const lastQuestion = questions[questions.length - 1];
      if (lastQuestion) {
        lastQuestion.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const addCategorizeQuestion = () => {
    const newQuestion = {
      type: 'categorize',
      title: '',
      categories: [],
      items: []
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    scrollToNewQuestion();
  };

  const addClozeQuestion = () => {
    const newQuestion = {
      type: 'cloze',
      title: '',
      text: '',
      blanks: []
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    scrollToNewQuestion();
  };

  const addComprehensionQuestion = () => {
    const newQuestion = {
      type: 'comprehension',
      title: '',
      paragraph: '',
      questions: []
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    scrollToNewQuestion();
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    try {
      setSaving(true);
      if (id) {
        await api.put(`/api/forms/${id}`, form);
        toast.success('Form updated successfully');
      } else {
        const response = await api.post('/api/forms', form);
        toast.success('Form created successfully');
        navigate(`/builder/${response.data._id}`);
      }
    } catch (error) {
      toast.error('Failed to save form');
      console.error('Error saving form:', error);
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      image: '',
      categories: type === 'categorize' ? ['Category 1', 'Category 2'] : [],
      items: type === 'categorize' ? [
        { text: 'Item 1', correctCategory: 'Category 1' },
        { text: 'Item 2', correctCategory: 'Category 2' }
      ] : [],
      text: type === 'cloze' ? 'THE CAT IS ON THE MAT' : '',
      blanks: type === 'cloze' ? [] : [],
      paragraph: type === 'comprehension' ? 'Enter your comprehension paragraph here.' : '',
      questions: type === 'comprehension' ? [
        {
          question: 'Sample question?',
          options: [
            { text: 'Option A', isCorrect: false },
            { text: 'Option B', isCorrect: true },
            { text: 'Option C', isCorrect: false },
            { text: 'Option D', isCorrect: false }
          ],
          correctAnswer: 1
        }
      ] : []
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? updatedQuestion : q
      )
    }));
  };

  const deleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setForm(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const moveQuestion = (fromIndex, toIndex) => {
    const newQuestions = [...form.questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    
    setForm(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const updateHeaderImage = (imageUrl) => {
    setForm(prev => ({
      ...prev,
      headerImage: imageUrl
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {id ? 'Edit Form' : 'Create New Form'}
          </h1>
          <p className="text-gray-600 mt-2">
            Build your custom form with interactive questions
          </p>
          {id && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                form.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {form.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/preview/${id}`)}
            disabled={!id}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
              id
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Form'}</span>
          </button>
          {id && (
            <button
              onClick={async () => {
                try {
                  await api.patch(`/api/forms/${id}/publish`, { 
                    isPublished: !form.isPublished 
                  });
                  setForm(prev => ({ ...prev, isPublished: !prev.isPublished }));
                  toast.success(form.isPublished ? 'Form unpublished' : 'Form published');
                } catch (error) {
                  toast.error('Failed to update publish status');
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
                form.isPublished
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {form.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Form Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter form title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter form description"
            />
          </div>

          <HeaderImageUpload
            currentImage={form.headerImage}
            onImageUpdate={updateHeaderImage}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="question-card scroll-mt-24 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Questions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addCategorizeQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              <Plus size={14} className="inline mr-1 sm:w-4 sm:h-4" />
              Add Categorize Question
            </button>
            <button
              onClick={addClozeQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              <Plus size={14} className="inline mr-1 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cloze</span>
              <span className="sm:hidden">Cloze</span>
            </button>
            <button
              onClick={addComprehensionQuestion}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
            >
              <Plus size={14} className="inline mr-1 sm:w-4 sm:h-4" />
              Add Comprehension Question
            </button>
          </div>
        </div>

        {form.questions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-6">Add your first question to get started</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button
                onClick={() => addQuestion('categorize')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Add Categorize Question
              </button>
              <button
                onClick={() => addQuestion('cloze')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Add Cloze Question
              </button>
              <button
                onClick={addComprehensionQuestion}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Add Comprehension Question
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {form.questions.map((question, index) => (
              <div key={index} className="question-card border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
                      question.type === 'categorize' ? 'bg-green-100 text-green-800' :
                      question.type === 'cloze' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      <span className="hidden sm:inline">{question.type}</span>
                      <span className="sm:hidden">
                        {question.type === 'categorize' ? 'Cat' :
                         question.type === 'cloze' ? 'Cloze' : 'Comp'}
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-2 self-start">
                    <button
                      onClick={() => deleteQuestion(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <QuestionEditor
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, XCircle } from 'lucide-react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const FormPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/forms/${id}`);
      setForm(response.data);
      
      const initialResponses = {};
      response.data.questions.forEach((question, index) => {
        switch (question.type) {
          case 'categorize':
            initialResponses[index] = {
              type: question.type,
              answer: {}
            };
            break;
          case 'cloze':
            initialResponses[index] = {
              type: question.type,
              answer: {}
            };
            break;
          case 'comprehension':
            initialResponses[index] = {
              type: question.type,
              answer: {}
            };
            break;
          default:
            initialResponses[index] = {
              type: question.type,
              answer: null
            };
        }
      });
      setResponses(initialResponses);
    } catch (error) {
      toast.error('Failed to fetch form');
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, itemText) => {
    e.dataTransfer.setData('text/plain', itemText);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, categoryName, questionIndex) => {
    e.preventDefault();
    const itemText = e.dataTransfer.getData('text/plain');
    
    setResponses(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        answer: {
          ...prev[questionIndex]?.answer,
          [itemText]: categoryName
        }
      }
    }));
  };

  const handleResponseChange = (questionIndex, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        answer
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const validResponses = Object.entries(responses).filter(([index, response]) => {
        if (!response.answer) return false;
        
        switch (response.type) {
          case 'categorize':
            return Object.keys(response.answer).length > 0;
          case 'cloze':
            return Object.keys(response.answer).length > 0;
          case 'comprehension':
            return Object.keys(response.answer).length > 0;
          default:
            return response.answer !== null && response.answer !== '';
        }
      });

      if (validResponses.length === 0) {
        toast.error('Please answer at least one question before submitting');
        return;
      }

      const responseData = {
        formId: id,
        responses: validResponses.map(([index, response]) => ({
          questionId: parseInt(index),
          type: response.type,
          answer: response.answer
        }))
      };

      await api.post('/api/responses', responseData);
      toast.success('Form submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Form submission failed. Please check your answers.');
      } else {
        toast.error('Failed to submit form');
      }
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCategorizeQuestion = (question, questionIndex) => {
    const currentResponses = responses[questionIndex]?.answer || {};

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
        
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Items to categorize:</h4>
            <div className="space-y-2 min-h-[200px] p-3 border-2 border-dashed border-gray-300 rounded-lg">
              {question.items.map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.text)}
                  className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Categories:</h4>
            <div className="space-y-3">
              {question.categories.map((category, catIndex) => (
                <div
                  key={catIndex}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category, questionIndex)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[100px] hover:border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  <h5 className="font-medium text-gray-700 mb-2">{category}</h5>
                  <div className="space-y-2">
                    {Object.entries(currentResponses).map(([itemText, categoryName]) => {
                      if (categoryName === category) {
                        return (
                          <div key={itemText} className="p-2 bg-primary-100 text-primary-800 rounded text-sm">
                            {itemText}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClozeQuestion = (question, questionIndex) => {
    const currentAnswer = responses[questionIndex]?.answer || {};

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
        
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
        )}

        <div className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              {question.text.split(' ').map((word, wordIndex) => {
                const blankIndex = question.blanks.findIndex(blank => blank.text === word.trim());
                if (blankIndex !== -1) {
                  return (
                    <span key={wordIndex}>
                      <span className="inline-block w-24 h-8 border-b-2 border-gray-400 mx-1 text-center text-sm text-gray-500">
                        {blankIndex + 1}
                      </span>
                      {' '}
                    </span>
                  );
                }
                return <span key={wordIndex}>{word} </span>;
              })}
            </p>
          </div>
          
          <div className="space-y-3">
            {question.blanks.map((blank, blankIndex) => (
              <div key={blankIndex} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-medium">Blank {blankIndex + 1}:</span>
                <input
                  type="text"
                  value={currentAnswer[blankIndex] || ''}
                  onChange={(e) => {
                    const newAnswer = { ...currentAnswer, [blankIndex]: e.target.value };
                    handleResponseChange(questionIndex, newAnswer);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your answer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComprehensionQuestion = (question, questionIndex) => {
    const currentAnswers = responses[questionIndex]?.answer || {};

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
        
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="w-full max-w-md h-48 object-cover rounded-lg border"
          />
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{question.paragraph}</p>
          </div>

          <div className="space-y-4">
            {question.questions.map((mcq, mcqIndex) => (
              <div key={mcqIndex} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  Question {mcqIndex + 1}: {mcq.question}
                </h4>
                
                <div className="space-y-2">
                  {mcq.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`mcq-${questionIndex}-${mcqIndex}`}
                        value={optionIndex}
                        checked={currentAnswers[mcqIndex] === optionIndex}
                        onChange={(e) => {
                          const newAnswers = { ...currentAnswers, [mcqIndex]: parseInt(e.target.value) };
                          handleResponseChange(questionIndex, newAnswers);
                        }}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'categorize':
        return renderCategorizeQuestion(question, index);
      case 'cloze':
        return renderClozeQuestion(question, index);
      case 'comprehension':
        return renderComprehensionQuestion(question, index);
      default:
        return <div>Unknown question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Form not found</h2>
        <p className="text-gray-600 mb-6">The form you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h2>
        <p className="text-gray-600 mb-8">Your form has been submitted successfully.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors self-start"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{form.description}</p>
          )}
        </div>
      </div>

      {form.headerImage && (
        <div className="w-full h-48 overflow-hidden rounded-lg">
          <img
            src={form.headerImage}
            alt="Header"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {form.questions.map((question, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            {renderQuestion(question, index)}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 sm:px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-sm sm:text-base"
        >
          <Send size={18} className="sm:w-5 sm:h-5" />
          <span>{submitting ? 'Submitting...' : 'Submit Form'}</span>
        </button>
      </div>
    </div>
  );
};

export default FormPreview;
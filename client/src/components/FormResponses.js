import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3, Users, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [formResponse, responsesResponse, statsResponse] = await Promise.all([
        axios.get(`/api/forms/${id}`),
        axios.get(`/api/responses/form/${id}`),
        axios.get(`/api/responses/stats/${id}`)
      ]);

      setForm(formResponse.data);
      setResponses(responsesResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch form data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportResponses = () => {
    if (responses.length === 0) {
      toast.error('No responses to export');
      return;
    }

    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form?.title || 'form'}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    if (!form || responses.length === 0) return '';

    const headers = ['Response ID', 'Submitted At'];
    form.questions.forEach((question, index) => {
      headers.push(`Q${index + 1}: ${question.title}`);
    });

    const csvRows = [headers.join(',')];

    responses.forEach((response) => {
      const row = [
        response._id,
        new Date(response.submittedAt).toLocaleString()
      ];

      form.questions.forEach((question, index) => {
        const questionResponse = response.responses.find(r => r.questionId === index);
        if (questionResponse) {
          row.push(formatAnswerForCSV(questionResponse.answer, question.type));
        } else {
          row.push('');
        }
      });

      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const formatAnswerForCSV = (answer, type) => {
    if (!answer) return '';

    switch (type) {
      case 'categorize':
        return Object.entries(answer)
          .map(([item, category]) => `${item}: ${category}`)
          .join('; ');
      case 'cloze':
        return Object.values(answer).join('; ');
      case 'comprehension':
        return Object.values(answer)
          .map((optionIndex, index) => `Q${index + 1}: Option ${String.fromCharCode(65 + optionIndex)}`)
          .join('; ');
      default:
        return String(answer);
    }
  };

  const renderResponseAnswer = (answer, question) => {
    if (!answer) return <span className="text-gray-400">No answer</span>;

    switch (question.type) {
      case 'categorize':
        return (
          <div className="space-y-2">
            {Object.entries(answer).map(([item, category]) => (
              <div key={item} className="flex items-center space-x-2">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{item}</span>
                <span className="text-gray-500">→</span>
                <span className="text-sm bg-blue-100 px-2 py-1 rounded">{category}</span>
              </div>
            ))}
          </div>
        );
      case 'cloze':
        return (
          <div className="space-y-1">
            {Object.entries(answer).map(([blankIndex, answerText]) => (
              <div key={blankIndex} className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Blank {parseInt(blankIndex) + 1}:</span>
                <span className="text-sm bg-green-100 px-2 py-1 rounded">{answerText}</span>
              </div>
            ))}
          </div>
        );
      case 'comprehension':
        return (
          <div className="space-y-1">
            {Object.entries(answer).map(([questionIndex, optionIndex]) => (
              <div key={questionIndex} className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Q{parseInt(questionIndex) + 1}:</span>
                <span className="text-sm bg-purple-100 px-2 py-1 rounded">
                  Option {String.fromCharCode(65 + optionIndex)}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return <span className="text-sm">{String(answer)}</span>;
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

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Form Responses</p>
          </div>
        </div>
        <button
          onClick={exportResponses}
          disabled={responses.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Download size={14} className="sm:w-4 sm:h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Responses</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalResponses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-green-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Questions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{form.questions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-purple-600 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Created</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
          <p className="text-gray-600">Share your form to start collecting responses</p>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((response, responseIndex) => (
            <div key={response._id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Response #{responseIndex + 1}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(response.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {form.questions.map((question, questionIndex) => {
                  const questionResponse = response.responses.find(r => r.questionId === questionIndex);
                  return (
                    <div key={questionIndex} className="border-l-4 border-gray-200 pl-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Q{questionIndex + 1}: {question.title}
                      </h4>
                      <div className="text-sm text-gray-700">
                        {questionResponse ? (
                          renderResponseAnswer(questionResponse.answer, question)
                        ) : (
                          <span className="text-gray-400">No answer provided</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormResponses;




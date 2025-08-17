import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X } from 'lucide-react';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const QuestionEditor = ({ question, index, onUpdate, onDelete }) => {
  const [uploading, setUploading] = useState(false);

  const updateQuestion = (updates) => {
    onUpdate(index, { ...question, ...updates });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      
      // Convert file to base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64String = reader.result;
          console.log('Sending base64 string:', base64String.slice(0, 50) + '...'); // Debug log
          const response = await api.post('/api/upload', { image: base64String });
          updateQuestion({ image: response.data.imageUrl });
          toast.success('Image uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload image');
          console.error('Error uploading image:', error);
        } finally {
          setUploading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Failed to process image');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to process image');
      console.error('Error processing image:', error);
      setUploading(false);
    }
  };

  const removeImage = () => {
    updateQuestion({ image: '' });
  };

  const renderCategorizeEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Image
        </label>
        {question.image ? (
          <div className="relative">
            <img
              src={question.image}
              alt="Question"
              className="w-full max-w-md h-48 object-cover rounded-lg border"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
              id={`image-upload-${index}`}
              disabled={uploading}
            />
            <label
              htmlFor={`image-upload-${index}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const newCategories = Array.from(question.categories);
            const [removed] = newCategories.splice(result.source.index, 1);
            newCategories.splice(result.destination.index, 0, removed);
            updateQuestion({ categories: newCategories });
          }}
        >
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {question.categories.map((category, catIndex) => (
                  <Draggable
                    key={catIndex.toString()}
                    draggableId={`category-${catIndex}`}
                    index={catIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200"
                      >
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => {
                            const newCategories = [...question.categories];
                            newCategories[catIndex] = e.target.value;
                            updateQuestion({ categories: newCategories });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Category name"
                        />
                        <button
                          onClick={() => {
                            const newCategories = question.categories.filter((_, i) => i !== catIndex);
                            updateQuestion({ categories: newCategories });
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => {
            const newCategories = [...question.categories, `Category ${question.categories.length + 1}`];
            updateQuestion({ categories: newCategories });
          }}
          className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items to Categorize
        </label>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            const newItems = Array.from(question.items);
            const [removed] = newItems.splice(result.source.index, 1);
            newItems.splice(result.destination.index, 0, removed);
            updateQuestion({ items: newItems });
          }}
        >
          <Droppable droppableId="items">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {question.items.map((item, itemIndex) => (
                  <Draggable
                    key={itemIndex.toString()}
                    draggableId={`item-${itemIndex}`}
                    index={itemIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200"
                      >
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const newItems = [...question.items];
                            newItems[itemIndex] = { ...newItems[itemIndex], text: e.target.value };
                            updateQuestion({ items: newItems });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Item text"
                        />
                        <select
                          value={item.correctCategory}
                          onChange={(e) => {
                            const newItems = [...question.items];
                            newItems[itemIndex] = { ...newItems[itemIndex], correctCategory: e.target.value };
                            updateQuestion({ items: newItems });
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {question.categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const newItems = question.items.filter((_, i) => i !== itemIndex);
                            updateQuestion({ items: newItems });
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button
          onClick={() => {
            const newItems = [...question.items, { text: `Item ${question.items.length + 1}`, correctCategory: question.categories[0] || '' }];
            updateQuestion({ items: newItems });
          }}
          className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>
    </div>
  );

  const renderClozeEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Image
        </label>
        {question.image ? (
          <div className="relative">
            <img
              src={question.image}
              alt="Question"
              className="w-full max-w-md h-48 object-cover rounded-lg border"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
              id={`image-upload-${index}`}
              disabled={uploading}
            />
            <label
              htmlFor={`image-upload-${index}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Text
        </label>
        <textarea
          value={question.text}
          onChange={(e) => updateQuestion({ text: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your full text here, e.g., 'THE CAT IS ON THE MAT'"
        />
        <p className="text-sm text-gray-500 mt-1">
          Tip: Type your complete text here. Then add blanks below by selecting words to become blanks.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Blanks
        </label>
        <div className="space-y-3">
          {question.blanks.map((blank, blankIndex) => (
            <div key={blankIndex} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 font-medium">Blank {blankIndex + 1}:</span>
              <select
                value={blank.text}
                onChange={(e) => {
                  const newBlanks = [...question.blanks];
                  newBlanks[blankIndex] = { ...newBlanks[blankIndex], text: e.target.value };
                  updateQuestion({ blanks: newBlanks });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a word from the text</option>
                {question.text.split(' ').map((word, wordIndex) => (
                  <option key={wordIndex} value={word.trim()}>
                    {word.trim()}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600 font-medium">Answer:</span>
              <input
                type="text"
                value={blank.correctAnswer}
                onChange={(e) => {
                  const newBlanks = [...question.blanks];
                  newBlanks[blankIndex] = { ...newBlanks[blankIndex], correctAnswer: e.target.value };
                  updateQuestion({ blanks: newBlanks });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Correct answer"
              />
              <button
                onClick={() => {
                  const newBlanks = question.blanks.filter((_, i) => i !== blankIndex);
                  updateQuestion({ blanks: newBlanks });
                }}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newBlanks = [...question.blanks, { text: '', correctAnswer: '' }];
              updateQuestion({ blanks: newBlanks });
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Add Blank</span>
          </button>
        </div>
      </div>

      {question.text && question.blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="p-4 bg-gray-50 rounded-lg">
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
        </div>
      )}
    </div>
  );

  const renderComprehensionEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Title
        </label>
        <input
          type="text"
          value={question.title}
          onChange={(e) => updateQuestion({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter question title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Image
        </label>
        {question.image ? (
          <div className="relative">
            <img
              src={question.image}
              alt="Question"
              className="w-full max-w-md h-48 object-cover rounded-lg border"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="hidden"
              id={`image-upload-${index}`}
              disabled={uploading}
            />
            <label
              htmlFor={`image-upload-${index}`}
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comprehension Paragraph
        </label>
        <textarea
          value={question.paragraph}
          onChange={(e) => updateQuestion({ paragraph: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter the comprehension paragraph here"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Multiple Choice Questions
          </label>
          <button
            onClick={() => {
              const newQuestions = [...question.questions, {
                question: 'New question?',
                options: [
                  { text: 'Option A', isCorrect: false },
                  { text: 'Option B', isCorrect: true },
                  { text: 'Option C', isCorrect: false },
                  { text: 'Option D', isCorrect: false }
                ],
                correctAnswer: 1
              }];
              updateQuestion({ questions: newQuestions });
            }}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <Plus size={16} />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {question.questions.map((mcq, mcqIndex) => (
            <div key={mcqIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-700">Question {mcqIndex + 1}</span>
                <button
                  onClick={() => {
                    const newQuestions = question.questions.filter((_, i) => i !== mcqIndex);
                    updateQuestion({ questions: newQuestions });
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={mcq.question}
                  onChange={(e) => {
                    const newQuestions = [...question.questions];
                    newQuestions[mcqIndex] = { ...newQuestions[mcqIndex], question: e.target.value };
                    updateQuestion({ questions: newQuestions });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter question"
                />

                <div className="space-y-2">
                  {mcq.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${mcqIndex}`}
                        checked={mcq.correctAnswer === optionIndex}
                        onChange={() => {
                          const newQuestions = [...question.questions];
                          newQuestions[mcqIndex] = { ...newQuestions[mcqIndex], correctAnswer: optionIndex };
                          updateQuestion({ questions: newQuestions });
                        }}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const newQuestions = [...question.questions];
                          newQuestions[mcqIndex].options[optionIndex] = { ...newQuestions[mcqIndex].options[optionIndex], text: e.target.value };
                          updateQuestion({ questions: newQuestions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                      <button
                        onClick={() => {
                          const newQuestions = [...question.questions];
                          newQuestions[mcqIndex].options = newQuestions[mcqIndex].options.filter((_, i) => i !== optionIndex);
                          if (newQuestions[mcqIndex].correctAnswer >= optionIndex) {
                            newQuestions[mcqIndex].correctAnswer = Math.max(0, newQuestions[mcqIndex].correctAnswer - 1);
                          }
                          updateQuestion({ questions: newQuestions });
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newQuestions = [...question.questions];
                      newQuestions[mcqIndex].options.push({
                        text: `Option ${String.fromCharCode(65 + newQuestions[mcqIndex].options.length)}`,
                        isCorrect: false
                      });
                      updateQuestion({ questions: newQuestions });
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>Add Option</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (question.type) {
      case 'categorize':
        return renderCategorizeEditor();
      case 'cloze':
        return renderClozeEditor();
      case 'comprehension':
        return renderComprehensionEditor();
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="space-y-4">
      {renderEditor()}
    </div>
  );
};

export default QuestionEditor;




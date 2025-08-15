const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean
});

const clozeBlankSchema = new mongoose.Schema({
  text: String,
  correctAnswer: String
});

const comprehensionQuestionSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema],
  correctAnswer: Number
});

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['categorize', 'cloze', 'comprehension'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: String,
  categories: [String],
  items: [{
    text: String,
    correctCategory: String
  }],
  text: String,
  blanks: [clozeBlankSchema],
  paragraph: String,
  questions: [comprehensionQuestionSchema]
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  headerImage: String,
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

formSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Form', formSchema);

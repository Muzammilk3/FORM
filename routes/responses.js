const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');

router.get('/form/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { formId, responses } = req.body;
    
    if (!formId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ 
        message: 'Invalid request: formId and responses array are required' 
      });
    }

    if (responses.length === 0) {
      return res.status(400).json({ 
        message: 'At least one response is required' 
      });
    }

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (!response.questionId && response.questionId !== 0) {
        return res.status(400).json({ 
          message: `Response ${i + 1}: questionId is required` 
        });
      }
      if (!response.type) {
        return res.status(400).json({ 
          message: `Response ${i + 1}: type is required` 
        });
      }
      if (response.answer === null || response.answer === undefined) {
        return res.status(400).json({ 
          message: `Response ${i + 1}: answer cannot be null or undefined` 
        });
      }
    }
    
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    if (!form.isPublished) {
      return res.status(400).json({ message: 'Form is not published' });
    }
    
    const newResponse = new Response({
      formId,
      responses
    });
    
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Response submission error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/stats/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId });
    const totalResponses = responses.length;
    
    const stats = {
      totalResponses,
      averageTime: 0,
      questionStats: {}
    };
    
    if (totalResponses > 0) {
      const totalTime = responses.reduce((sum, response) => {
        return sum + (new Date() - new Date(response.submittedAt));
      }, 0);
      stats.averageTime = totalTime / totalResponses;
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

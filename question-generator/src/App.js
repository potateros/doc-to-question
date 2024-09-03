import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './components/Question';
import History from './components/History';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('questionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (newQuestions) => {
    const filename = file ? file.name : 'unnamed';
    const updatedHistory = [
      { id: `${filename}_${Date.now()}`, questions: newQuestions },
      ...history,
    ].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('questionHistory', JSON.stringify(updatedHistory));
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.questions) {
        const newQuestions = response.data.questions.map(q => ({
          ...q,
          userAnswer: getInitialUserAnswer(q.type),
          isCorrect: null
        }));
        setQuestions(newQuestions);
        saveToHistory(newQuestions);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialUserAnswer = (type) => {
    switch (type) {
      case 'checklist':
        return [];
      case 'multiple-choice':
      case 'true-false':
      case 'text':
        return '';
      default:
        return null;
    }
  };

  const handleAnswer = (index, answer) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].userAnswer = answer;
      return newQuestions;
    });
  };

  const handleSubmitAnswers = () => {
    setSubmitted(true);
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        isCorrect: checkAnswer(q.type, q.userAnswer, q.answer),
      }))
    );
  };

  const checkAnswer = (type, userAnswer, answer) => {
    if (userAnswer === null || userAnswer === undefined) {
      return false;
    }
    // Convert userAnswer and answer to string and array
    userAnswer = userAnswer.toString();
    answer = answer.toString();

    userAnswer = Array.isArray(userAnswer) ? userAnswer : userAnswer.split(',').sort();
    answer = Array.isArray(answer) ? answer : answer.split(',').sort();
    console.log(`type: ${type}`);
    console.log(`userAnswer: ${userAnswer}`);
    console.log(`answer: ${answer}`);

    switch (type) {
      case 'checklist':
      case 'multiple-choice':
      case 'true-false':
        return JSON.stringify(userAnswer) === JSON.stringify(answer);
      case 'text':
        return false;
      default:
        return false;
    }
  };

  const handleResetAnswers = () => {
    setSubmitted(false);
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, userAnswer: getInitialUserAnswer(q.type), isCorrect: null }))
    );
  };

  const handleLoadHistory = (historicalQuestions) => {
    setQuestions(historicalQuestions);
    setSubmitted(false);
  };

  return (
    <div className="app">
      <h1>PDF to Question Generator</h1>
      <div className="upload-section">
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? 'Processing...' : 'Upload and Generate Questions'}
          </button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {isLoading && (
        <div className="loading">
          <p>Processing PDF and generating questions...</p>
          <div className="spinner"></div>
        </div>
      )}

      <History history={history} onLoadHistory={handleLoadHistory} />

      <div className="questions-section">
        {questions.map((q, index) => (
          <Question
            key={index}
            {...q}
            onAnswer={(answer) => handleAnswer(index, answer)}
            submitted={submitted}
          />
        ))}
      </div>

      {questions.length > 0 && (
        <button onClick={submitted ? handleResetAnswers : handleSubmitAnswers} className="btn submit-btn">
          {submitted ? 'Reset Answers' : 'Submit Answers'}
        </button>
      )}
    </div>
  );
};

export default App;

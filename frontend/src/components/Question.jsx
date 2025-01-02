// Question.jsx
import React from 'react';
import Checklist from './Checklist';
import MultipleChoice from './MultipleChoice';
import TextResponse from './TextResponse';
import TrueFalse from './TrueFalse';
// import UnknownType from './UnknownType';
import './Question.css';

const Question = (props) => {
  const {
    type,
    question,
    options,
    answer,
    answers,
    onAnswer,
    userAnswer,
    isCorrect,
    submitted,
    explanation,
  } = props;

  const correctAnswer = answers || answer;

  const renderQuestionType = () => {
    const commonProps = { question, onAnswer, userAnswer, submitted };
    switch (type) {
      case 'checklist':
        return <Checklist {...commonProps} options={options} />;
      case 'multiple-choice':
        return <MultipleChoice {...commonProps} options={options} />;
      case 'text':
        return <TextResponse {...commonProps} />;
      case 'true-false':
        return <TrueFalse {...commonProps} />;
      default:
        return <TextResponse {...commonProps} />;
    }
  };

  const renderCorrectAnswer = () => {
    if (correctAnswer == null) {
      return 'Not available';
    }
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.sort().join(', ');
    }
    if (typeof correctAnswer === 'boolean') {
      return correctAnswer ? 'True' : 'False';
    }
    return correctAnswer.toString();
  };

  const renderUserAnswer = () => {
    if (userAnswer == null) {
      return 'No answer provided';
    }
    if (Array.isArray(userAnswer)) {
      return userAnswer.sort().join(', ');
    }
    if (typeof userAnswer === 'boolean') {
      return userAnswer ? 'True' : 'False';
    }
    return userAnswer.toString();
  };

  return (
    <div
      className={`question ${
        submitted ? (isCorrect ? 'correct' : 'incorrect') : ''
      }`}
    >
      {renderQuestionType()}
      {submitted && (
        <div className="feedback">
          <p className={isCorrect ? 'correct-text' : 'incorrect-text'}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p>
            <strong>Correct answer:</strong> {renderCorrectAnswer()}
          </p>
          {!isCorrect && (
            <p>
              <strong>Your answer:</strong> {renderUserAnswer()}
            </p>
          )}
          <p>
            <strong>Explanation:</strong> {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;

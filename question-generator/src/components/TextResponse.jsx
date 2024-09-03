import React from 'react';

const TextResponse = ({
  question,
  onAnswer,
  userAnswer,
  submitted,
  isCorrect,
}) => {
  const handleChange = (e) => {
    onAnswer(e.target.value);
  };

  return (
    <>
      <h3>{question}</h3>
      <div
        className={`text-response ${submitted && isCorrect ? 'correct' : ''}`}
      >
        <textarea
          onChange={handleChange}
          placeholder="Type your answer here..."
          rows="4"
          className="text-area"
          value={userAnswer || ''}
          disabled={submitted}
        />
      </div>
    </>
  );
};

export default TextResponse;

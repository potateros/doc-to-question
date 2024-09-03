import React from 'react';

const TrueFalse = ({ question, onAnswer, userAnswer, submitted }) => {
  // Generate a unique identifier for this question
  const questionId = React.useMemo(
    () => `tf_${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const handleChange = (e) => {
    onAnswer(e.target.value === 'true');
  };

  return (
    <>
      <h3>{question}</h3>
      <div className="options">
        <div className="option">
          <input
            type="radio"
            id={`${questionId}-true`}
            name={questionId}
            value="true"
            onChange={handleChange}
            checked={userAnswer === true}
            disabled={submitted}
          />
          <label htmlFor={`${questionId}-true`}>True</label>
        </div>
        <div className="option">
          <input
            type="radio"
            id={`${questionId}-false`}
            name={questionId}
            value="false"
            onChange={handleChange}
            checked={userAnswer === false}
            disabled={submitted}
          />
          <label htmlFor={`${questionId}-false`}>False</label>
        </div>
      </div>
    </>
  );
};

export default TrueFalse;

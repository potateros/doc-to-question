import React from 'react';

const MultipleChoice = ({
  question,
  options,
  onAnswer,
  userAnswer,
  submitted,
}) => {
  // Generate a unique identifier for this question
  const questionId = React.useMemo(
    () => `mc_${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const handleChange = (e) => {
    onAnswer(e.target.value);
  };

  return (
    <>
      <h3>{question}</h3>
      <div className="options">
        {options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              id={`${questionId}-${index}`}
              name={questionId}
              value={option}
              onChange={handleChange}
              checked={userAnswer === option}
              disabled={submitted}
            />
            <label htmlFor={`${questionId}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default MultipleChoice;

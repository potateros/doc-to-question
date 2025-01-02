import React from 'react';

const Checklist = ({ question, options, onAnswer, userAnswer, submitted }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    const updatedAnswer = Array.isArray(userAnswer) ? [...userAnswer] : [];

    if (updatedAnswer.includes(value)) {
      // Remove the option if it's already selected
      onAnswer(updatedAnswer.filter((item) => item !== value));
    } else {
      // Add the option if it's not already selected
      onAnswer([...updatedAnswer, value]);
    }
  };

  return (
    <>
      <h3>{question}</h3>
      <div className="options">
        {options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="checkbox"
              id={`checklist-${question}-${index}`}
              value={option}
              onChange={handleChange}
              checked={Array.isArray(userAnswer) && userAnswer.includes(option)}
              disabled={submitted}
            />
            <label htmlFor={`checklist-${question}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default Checklist;

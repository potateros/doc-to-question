import React from 'react';
import './History.css';

const History = ({ history, onLoadHistory }) => {
  if (history.length === 0) {
    return null;
  }

  const formatHistoryItem = (id) => {
    let filename = 'Unknown';
    let timestamp = Date.now().toString();

    if (typeof id === 'string') {
      const parts = id.split('_');
      filename = parts[0] || filename;
      timestamp = parts[1] || timestamp;
    } else if (id && typeof id === 'object') {
      // Assuming id might be an object with filename and timestamp properties
      filename = id.filename || filename;
      timestamp = id.timestamp || timestamp;
    }
    const date = new Date(parseInt(timestamp));
    return `${filename} - ${date.toLocaleString()}`;
  };

  return (
    <div className="history">
      <h2>Recent Question Sets</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id} onClick={() => onLoadHistory(item.questions)}>
            {formatHistoryItem(item.id)} - {item.questions.length} questions
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;

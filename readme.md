# PDF to Question Generator

This project is a web application that allows users to upload PDF documents and automatically generate questions based on the content. It uses React for the frontend and Node.js with Express for the backend.

![Screenshot of the application](./screenshot.jpg)

## Features

- Upload PDF documents
- Generate multiple types of questions (multiple-choice, true/false, checklist, text response)
- View generated questions
- Submit answers and receive feedback
- View history of previous question sets

## Setup

1. Clone the repository
2. Install dependencies:

```
npm install
cd question-generator
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the backend server:

```
npm run server
```

2. In a separate terminal, start the React frontend:

```
cd question-generator
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click the "Choose File" button to select a PDF document
2. Click "Upload and Generate Questions" to process the PDF and generate questions
3. Answer the generated questions
4. Click "Submit Answers" to see your results
5. Use the history feature to revisit previous question sets

## Development

- The main application logic is in `question-generator/src/App.js`
- Individual question components are in the `question-generator/src/components/` directory
- The backend server is in `server.js`

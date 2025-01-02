const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 4011;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer with absolute path
const upload = multer({
  dest: uploadsDir
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

const MAX_TOKENS = 4096; // Maximum tokens OpenAI API can handle, adjust as needed

// Summarize text to reduce token count
const summarizeText = async (text) => {
  console.log('Summarizing text...')
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: `Summarize the following text to reduce it to essential points:\n\n${text}` }],
      model: "gpt-4o-mini",
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return text; // Return original text if summarization fails
  }
};

// Route to upload PDF and generate questions
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  const pdfPath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const fullText = pdfData.text;

    // Split text into chunks to fit within token limits
    const textChunks = [];
    let chunk = '';

    fullText.split(/\n\s*\n/).forEach((paragraph) => {
      if (chunk.length + paragraph.length > MAX_TOKENS * 4) { // Adjust to prevent exceeding token limit
        textChunks.push(chunk);
        chunk = '';
      }
      chunk += paragraph + '\n\n';
    });

    if (chunk) textChunks.push(chunk); // Add the last chunk

    // Summarize each chunk
    const summarizedChunks = await Promise.all(
      textChunks.map(async (text) => await summarizeText(text))
    );

    const summarizedText = summarizedChunks.join('\n\n');

    // Send the summarized text to OpenAI API to generate questions
    // const exampleJson = `
    //   [
    //     {
    //       "type": "true-false",
    //       "question": "The Transformer model requires less training time compared to RNN-based models.",
    //       "answer": true
    //     },
    //     {
    //       "type": "checklist",
    //       "question": "Select the benefits of using self-attention in sequence transduction tasks.",
    //       "options": ["Parallelization", "Reduced Path Length", "Sequential Computation", "Memory Efficiency"],
    //       "answer": ["Parallelization", "Reduced Path Length"]
    //     },
    //     {
    //       "type": "text",
    //       "question": "Explain how positional encoding is used in the Transformer model.",
    //       "answer": "Positional encoding is used to inject information about the relative or absolute position of tokens in a sequence since the Transformer model lacks recurrence and convolution."
    //     },
    //     {
    //       "type": "multiple-choice",
    //       "question": "What does the scaling factor 1/√dk address in the scaled dot-product attention?",
    //       "options": ["Gradient Vanishing", "Gradient Exploding", "Computational Complexity", "Softmax Saturation"],
    //       "answer": "Softmax Saturation"
    //     },
    //   ]`
    const exampleJson = `
      [
        {
          "type": "true-false",
          "question": "The Transformer model requires less training time compared to RNN-based models.",
          "answer": true,
          "explanation": "The Transformer model uses self-attention mechanisms, which allow for parallel computation, making it faster to train than RNN-based models."
        },
        {
          "type": "checklist",
          "question": "Select the benefits of using self-attention in sequence transduction tasks.",
          "options": ["Parallelization", "Reduced Path Length", "Sequential Computation", "Memory Efficiency"],
          "answer": ["Parallelization", "Reduced Path Length"],
          "explanation": "Self-attention mechanisms in the Transformer model enable parallel computation, reducing training time and allowing for longer sequences. Additionally, self-attention allows the model to focus on relevant parts of the input sequence, reducing the path length and improving performance."
        },
        {
          "type": "multiple-choice",
          "question": "What does the scaling factor 1/√dk address in the scaled dot-product attention?",
          "options": ["Gradient Vanishing", "Gradient Exploding", "Computational Complexity", "Softmax Saturation"],
          "answer": "Softmax Saturation",
          "explanation": "The scaling factor 1/√dk in the scaled dot-product attention is used to address softmax saturation. Without this scaling, the softmax function may output values close to 0 or 1, leading to gradients that are close to 0. This can cause the model to learn slowly or not at all."
        },
      ]`

    // Send the text to OpenAI API to generate questions
    const prompt = `Based on the following text, generate a JSON structure with various types of questions: multiple-choice, true/false, and checklist. The explanation should be related to the question-answer, explaning concisely what is the correct answer and why is it so. Here is an example of the JSON structure you should return: ${exampleJson}. Give me 10 questions, with any combination of the 4 types of questions, Here is the text:\n\n${summarizedText}`;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const rawOutput = response.choices[0].message.content;
    const questionJSON = rawOutput.match(/```json([\s\S]*?)```/)[1].trim();
    const questions = JSON.parse(questionJSON);

    console.log(`questions: ${questions}`)

    // Return the questions to the frontend
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process PDF' });
  } finally {
    // Cleanup
    fs.unlinkSync(pdfPath);
  }
});

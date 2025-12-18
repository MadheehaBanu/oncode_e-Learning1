const express = require('express');
const router = express.Router();

// Mock quiz data
let quizzes = [
  {
    id: 'quiz-1',
    courseId: '1',
    courseName: 'Complete Web Development Bootcamp',
    title: 'HTML & CSS Fundamentals',
    description: 'Test your knowledge of HTML and CSS basics',
    timeLimit: 15,
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which CSS property is used to change the text color?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2
      }
    ]
  }
];

let quizResults = [];

// Get quizzes for a course
router.get('/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  const courseQuizzes = quizzes.filter(quiz => quiz.courseId === courseId);
  res.json({ success: true, data: courseQuizzes });
});

// Get specific quiz
router.get('/:quizId', (req, res) => {
  const { quizId } = req.params;
  const quiz = quizzes.find(q => q.id === quizId);
  
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }
  
  res.json({ success: true, data: quiz });
});

// Submit quiz result
router.post('/submit', (req, res) => {
  const { userId, courseId, quizId, answers, timeSpent } = req.body;
  
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }
  
  // Calculate score
  let correctAnswers = 0;
  quiz.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });
  
  const score = Math.round((correctAnswers / quiz.questions.length) * 100);
  
  const result = {
    id: Date.now().toString(),
    userId,
    courseId,
    quizId,
    courseName: quiz.courseName,
    quizTitle: quiz.title,
    score,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    timeSpent,
    completedAt: new Date().toISOString()
  };
  
  quizResults.push(result);
  
  res.json({
    success: true,
    message: 'Quiz submitted successfully',
    data: result
  });
});

// Get user's quiz results
router.get('/results/:userId', (req, res) => {
  const { userId } = req.params;
  const userResults = quizResults.filter(result => result.userId === userId);
  res.json({ success: true, data: userResults });
});

// Admin: Create quiz
router.post('/', (req, res) => {
  const { courseId, title, description, timeLimit, questions } = req.body;
  
  const newQuiz = {
    id: `quiz-${Date.now()}`,
    courseId,
    title,
    description,
    timeLimit,
    questions,
    createdAt: new Date().toISOString()
  };
  
  quizzes.push(newQuiz);
  
  res.json({
    success: true,
    message: 'Quiz created successfully',
    data: newQuiz
  });
});

// Admin: Get all quizzes
router.get('/', (req, res) => {
  res.json({ success: true, data: quizzes });
});

module.exports = router;
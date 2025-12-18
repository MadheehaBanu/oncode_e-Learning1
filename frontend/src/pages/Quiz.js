import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizzesAPI, enrollmentsAPI } from '../services/api';

const Quiz = () => {
  const { courseId, quizId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load quiz data from backend
    const fetchQuiz = async () => {
      try {
        const response = await quizzesAPI.getQuiz(quizId);
        const quizData = response.data || response;
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        console.error('Failed to load quiz:', error);
        alert('Failed to load quiz. Please try again.');
      }
    };
    fetchQuiz();
  }, [courseId, quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);

    try {
      // Submit quiz result to backend
      await quizzesAPI.submitQuiz(quizId, {
        userId: currentUser.id,
        courseId,
        answers,
        score: finalScore,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeSpent: (quiz.timeLimit * 60) - timeLeft
      });

      // Update enrollment progress
      // Note: You may need to get the enrollment ID first
      // For now, just log the completion
      console.log('Quiz submitted successfully');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Continue anyway as user has finished the quiz
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-orange-100' : 'bg-red-100'
              }`}>
              <span className="text-4xl">
                {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className={`text-3xl font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                    {score}%
                  </div>
                  <p className="text-gray-600 text-sm">Your Score</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {quiz.questions.length - Object.keys(answers).length}/{quiz.questions.length}
                  </div>
                  <p className="text-gray-600 text-sm">Correct Answers</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Course
              </button>
              <button
                onClick={() => navigate('/my-results')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View All Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.courseName}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600 text-sm">Time Remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                    }`}>
                    {answers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
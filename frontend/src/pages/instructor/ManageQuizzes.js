/*import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ManageQuizzes = () => {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    timeLimit: 15,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, type: 'mcq' }]
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = () => {
    const allQuizzes = JSON.parse(localStorage.getItem('courseQuizzes') || '[]');
    const instructorCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]')
      .filter(c => c.instructor === currentUser?.name);
    
    const instructorQuizzes = allQuizzes.filter(q => 
      instructorCourses.some(c => c.id === q.courseId)
    );
    setQuizzes(instructorQuizzes);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { 
        question: '', 
        options: ['', '', '', ''], 
        correctAnswer: 0, 
        type: 'mcq' 
      }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...formData.questions];
    updated[index][field] = value;
    setFormData({ ...formData, questions: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    };

    const allQuizzes = JSON.parse(localStorage.getItem('courseQuizzes') || '[]');
    allQuizzes.push(newQuiz);
    localStorage.setItem('courseQuizzes', JSON.stringify(allQuizzes));
    
    setShowForm(false);
    loadQuizzes();
  };

  const instructorCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]')
    .filter(c => c.instructor === currentUser?.name);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Quizzes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Quiz
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Quiz</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
                  <select
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select Course</option>
                    {instructorCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Questions</h3>
                {formData.questions.map((q, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Question {index + 1}</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Enter question"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {q.options.map((option, optIndex) => (
                        <div key={optIndex}>
                          <label className="block text-sm font-medium mb-1">Option {optIndex + 1}</label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, 'options', newOptions);
                            }}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Correct Answer</label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {q.options.map((_, optIndex) => (
                          <option key={optIndex} value={optIndex}>Option {optIndex + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addQuestion}
                  className="text-blue-600 hover:text-blue-800"
                >
                  + Add Question
                </button>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  Create Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">My Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-600">No quizzes created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-gray-600 text-sm">{quiz.questions.length} questions • {quiz.timeLimit} minutes</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageQuizzes;*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
    loadQuizzes();
  }, [id, currentUser]);

  const checkEnrollment = () => {
    if (!currentUser) return;
    const userEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
    const enrollment = userEnrollments.find(e => e.userId === currentUser.id && e.courseId === id);
    if (enrollment) {
      setEnrolled(true);
      setUserProgress(enrollment.progress || 0);
    }
  };

  const loadQuizzes = () => {
    const courseQuizzes = JSON.parse(localStorage.getItem('courseQuizzes') || '[]');
    const courseSpecificQuizzes = courseQuizzes.filter(q => q.courseId === id);
    setQuizzes(courseSpecificQuizzes);
  };

  const fetchCourse = async () => {
    try {
      const courseData = await coursesAPI.getCourse(id);
      setCourse(courseData);
    } catch (error) {
      console.error('Error fetching course:', error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    console.log('Enroll clicked, currentUser:', currentUser);
    console.log('Course ID:', id);
    if (!currentUser) {
      navigate('/login');
      return;
    }
    console.log('Navigating to:', `/payment/${id}`);
    navigate(`/payment/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                  <span className="text-yellow-400 mr-2 text-lg">★</span>
                  <span className="font-bold text-lg">{course.rating}</span>
                  <span className="text-blue-200 ml-2">({course.students} students)</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                  <span className="mr-2">👨‍🏫</span>
                  <span className="text-blue-200">{course.instructor}</span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                  <span className="mr-2">⏱️</span>
                  <span className="text-blue-200">{course.duration}</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              What you'll learn
            </h3>
            <div className="space-y-4">
              {(course.whatYouWillLearn || course.whatYouLearn || []).map((item, index) => (
                <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3 mt-1 text-lg">✓</span>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
              <span className="mr-3">📝</span>
              Requirements
            </h3>
            <div className="space-y-3">
              {(course.requirements || []).map((req, index) => (
                <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-slate-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-blue-900 mb-8 flex items-center">
            <span className="mr-3">📚</span>
            Course Content
          </h3>
          <div className="space-y-3">
            {(course.courseContent || course.lessons || []).map((content, index) => {
              const title = typeof content === 'string' ? content : content.title;
              const duration = typeof content === 'object' ? content.duration : '';
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-800">{title}</span>
                  </div>
                  {duration && <span className="text-slate-500 text-sm">{duration}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quizzes Section - Only show if enrolled */}
        {enrolled && quizzes.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-blue-900 flex items-center">
                <span className="mr-3">📝</span>
                Course Quizzes
              </h3>
              <div className="text-right">
                <div className="text-sm text-gray-600">Your Progress</div>
                <div className="text-2xl font-bold text-blue-600">{userProgress}%</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {quizzes.map((quiz, index) => {
                const userQuizzes = JSON.parse(localStorage.getItem('userQuizzes') || '[]');
                const userQuiz = userQuizzes.find(uq => uq.userId === currentUser?.id && uq.quizId === quiz.id);
                const isCompleted = !!userQuiz;
                const score = userQuiz?.score || 0;
                
                return (
                  <div key={quiz.id} className={`border-2 rounded-xl p-6 transition-all ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>⏱️ {quiz.timeLimit} minutes</span>
                          <span>❓ {quiz.questions.length} questions</span>
                        </div>
                      </div>
                      {isCompleted && (
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {score}%
                          </div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link
                        to={`/quiz/${course.id}/${quiz.id}`}
                        className={`flex-1 text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                          isCompleted
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                      </Link>
                      {isCompleted && (
                        <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                          📊 Results
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enrollment Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-blue-100 mb-8 text-lg">Join thousands of students and master {course.category} today!</p>
            
            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <div className="text-5xl font-bold mb-2">
                {course.price == 0 ? 'Free' : `$${course.price}`}
              </div>
              <p className="text-blue-200">One-time payment • Lifetime access</p>
            </div>

            {currentUser ? (
              <div className="space-y-4">
                {enrolled ? (
                  <div className="bg-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="text-2xl">✅</span>
                      <span className="text-xl font-bold">You're Enrolled!</span>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-blue-200 mb-2">Course Progress</div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-white h-3 rounded-full transition-all duration-500"
                          style={{ width: `${userProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm text-blue-200 mt-1">{userProgress}% Complete</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/student/enrollments"
                        className="bg-white/20 text-white py-3 px-6 rounded-xl font-bold text-center hover:bg-white/30 transition-all"
                      >
                        Continue Learning
                      </Link>
                      {quizzes.length > 0 && (
                        <button className="bg-white text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-all">
                          Take Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full max-w-md mx-auto block py-4 px-8 rounded-xl font-bold text-xl bg-white text-blue-600 hover:bg-blue-50 transform hover:-translate-y-1 shadow-lg transition-all"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            ) : (
              <Link
                to="/register"
                className="inline-block bg-white text-blue-600 py-4 px-8 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Sign up to Enroll
              </Link>
            )}
          </div>
        </div>
        
        {/* Course Reviews */}
      </div>
    </div>
  );
};

export default CourseDetail;
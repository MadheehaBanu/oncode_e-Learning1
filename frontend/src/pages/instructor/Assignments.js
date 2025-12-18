import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Assignments = () => {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    loadAssignments();
    loadSubmissions();
  }, []);

  const loadAssignments = () => {
    const allAssignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const instructorCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]')
      .filter(c => c.instructor === currentUser?.name);
    
    const instructorAssignments = allAssignments.filter(a => 
      instructorCourses.some(c => c.id === a.courseId)
    );
    setAssignments(instructorAssignments);
  };

  const loadSubmissions = () => {
    const allSubmissions = JSON.parse(localStorage.getItem('assignmentSubmissions') || '[]');
    setSubmissions(allSubmissions);
  };

  const gradeSubmission = (submissionId, grade, feedback) => {
    const updated = submissions.map(s => 
      s.id === submissionId ? { ...s, grade, feedback, graded: true } : s
    );
    setSubmissions(updated);
    localStorage.setItem('assignmentSubmissions', JSON.stringify(updated));

    // Send notification to student
    const submission = submissions.find(s => s.id === submissionId);
    const notification = {
      id: Date.now().toString(),
      userId: submission.studentId,
      type: 'grade',
      title: 'Assignment Graded',
      message: `Your assignment has been graded: ${grade}/100`,
      read: false,
      createdAt: new Date().toISOString()
    };

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Assignment Submissions</h1>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Pending Reviews</h2>
          
          {submissions.filter(s => !s.graded).length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600">No pending submissions</p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.filter(s => !s.graded).map(submission => (
                <div key={submission.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{submission.assignmentTitle}</h3>
                      <p className="text-gray-600">Student: {submission.studentName}</p>
                      <p className="text-gray-600 text-sm">
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Pending Review
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Submission:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">{submission.content}</p>
                    {submission.fileUrl && (
                      <a 
                        href={submission.fileUrl} 
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        📎 View Attachment
                      </a>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Grade (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full p-2 border rounded"
                        id={`grade-${submission.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Feedback</label>
                      <textarea
                        rows="3"
                        className="w-full p-2 border rounded"
                        id={`feedback-${submission.id}`}
                        placeholder="Provide feedback to the student..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const grade = document.getElementById(`grade-${submission.id}`).value;
                      const feedback = document.getElementById(`feedback-${submission.id}`).value;
                      if (grade) {
                        gradeSubmission(submission.id, parseInt(grade), feedback);
                      }
                    }}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Submit Grade
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">Graded Submissions</h2>
          
          <div className="space-y-4">
            {submissions.filter(s => s.graded).map(submission => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{submission.assignmentTitle}</h3>
                    <p className="text-gray-600">Student: {submission.studentName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{submission.grade}/100</div>
                    <div className="text-sm text-gray-600">Graded</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
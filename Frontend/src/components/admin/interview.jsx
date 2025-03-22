import  { useState } from "react";

const InterviewScheduler = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    candidateName: "",
    candidateEmail: "",
    meetingId: generateRandomId(),
    interviewDate: "",
    interviewTime: "",
  });

  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  function generateRandomId() {
    return "INT-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Check if form is valid
    const {
      jobTitle,
      candidateName,
      candidateEmail,
      interviewDate,
      interviewTime,
    } = newFormData;
    setIsFormValid(
      jobTitle !== "" &&
        candidateName !== "" &&
        candidateEmail !== "" &&
        validateEmail(candidateEmail) &&
        interviewDate !== "" &&
        interviewTime !== ""
    );
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleScheduleInterview = () => {
    if (isFormValid) {
      if (editingId) {
        // Update existing interview
        const updatedInterviews = scheduledInterviews.map((interview) =>
          interview.id === editingId
            ? { ...formData, id: editingId }
            : interview
        );
        setScheduledInterviews(updatedInterviews);
        setEditingId(null);
      } else {
        // Create new interview
        const newInterview = {
          ...formData,
          id: Date.now(),
          scheduledAt: new Date().toLocaleString(),
        };

        setScheduledInterviews([...scheduledInterviews, newInterview]);
      }

      // Reset form
      setFormData({
        jobTitle: "",
        candidateName: "",
        candidateEmail: "",
        meetingId: generateRandomId(),
        interviewDate: "",
        interviewTime: "",
      });

      setIsFormValid(false);
      setShowForm(false);
    }
  };

  const handleEditInterview = (interview) => {
    setFormData({
      jobTitle: interview.jobTitle,
      candidateName: interview.candidateName,
      candidateEmail: interview.candidateEmail,
      meetingId: interview.meetingId,
      interviewDate: interview.interviewDate,
      interviewTime: interview.interviewTime,
    });
    setEditingId(interview.id);
    setShowForm(true);
  };

  const handleCancelInterview = (id) => {
    if (window.confirm("Are you sure you want to cancel this interview?")) {
      const updatedInterviews = scheduledInterviews.filter(
        (interview) => interview.id !== id
      );
      setScheduledInterviews(updatedInterviews);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 text-blue-900">
      <header className="bg-blue-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Interview Scheduler</h1>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Scheduled Interviews</h2>

            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({
                    jobTitle: "",
                    candidateName: "",
                    candidateEmail: "",
                    meetingId: generateRandomId(),
                    interviewDate: "",
                    interviewTime: "",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
              >
                Schedule Interview
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                {editingId ? "Edit Interview" : "New Interview"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Candidate Email
                  </label>
                  <input
                    type="email"
                    name="candidateEmail"
                    value={formData.candidateEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Meeting ID
                  </label>
                  <input
                    type="text"
                    value={formData.meetingId}
                    className="w-full p-2 rounded bg-gray-50 border border-blue-200 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Interview Time
                  </label>
                  <input
                    type="time"
                    name="interviewTime"
                    value={formData.interviewTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-300 font-medium py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleScheduleInterview}
                  disabled={!isFormValid}
                  className={`py-2 px-4 rounded font-medium transition-colors ${
                    isFormValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-200 text-blue-500 cursor-not-allowed"
                  }`}
                >
                  {editingId ? "Update Interview" : "Schedule Interview"}
                </button>
              </div>
            </div>
          )}

          {scheduledInterviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-blue-100">
              <p className="text-blue-800">No interviews scheduled yet.</p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Schedule Your First Interview
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100">
              <table className="w-full text-sm">
                <thead className="bg-blue-50 text-blue-800">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">
                      Job Title
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Candidate
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Meeting ID
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Date & Time
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledInterviews.map((interview) => (
                    <tr
                      key={interview.id}
                      className="border-b border-blue-100 hover:bg-blue-50"
                    >
                      <td className="py-3 px-4">{interview.jobTitle}</td>
                      <td className="py-3 px-4">
                        <div>{interview.candidateName}</div>
                        <div className="text-xs text-blue-600">
                          {interview.candidateEmail}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-700">
                        {interview.meetingId}
                      </td>
                      <td className="py-3 px-4">
                        <div>{interview.interviewDate}</div>
                        <div className="text-sm text-blue-600">
                          {interview.interviewTime}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditInterview(interview)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCancelInterview(interview.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewScheduler;

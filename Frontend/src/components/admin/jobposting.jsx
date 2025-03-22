import { useState, useEffect } from "react";
import {
  PlusCircle,
  MapPin,
  DollarSign,
  BookOpen,
  Code,
  Building,
  Users,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 



const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [candidates, setCandidates] = useState({});

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    location: "",
    salary: "",
    requirements: [""],
    techStack: [""],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleArrayInputChange = (index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newJob = {
      ...formData,
      requirements: formData.requirements.filter(Boolean),
      techStack: formData.techStack.filter(Boolean),
    };
    setShowForm(false);
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      const result = await response.json();
      setJobs((prev) => [...prev, result]);
    } catch (error) {
      console.log("error", error);
    }
  };

   const toggleApplications = (jobId) => {
     setExpandedJobId(expandedJobId === jobId ? null : jobId);
   };

  // Fetch jobs on component mount
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/job-list`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    getJobs();
  }, []);

    useEffect(() => {
      const getCandidates = async () => {
        if (!expandedJobId) return;
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/job/${expandedJobId}/candidates`
          );
          const data = await response.json();
          setCandidates((prev) => ({
            ...prev,
            [expandedJobId]: data || [], // Ensure we always have an array
          }));
        } catch (error) {
          console.error("Error fetching candidates:", error);
          setCandidates((prev) => ({
            ...prev,
            [expandedJobId]: [], // Set empty array on error
          }));
        }
      };

      if (expandedJobId) {
        getCandidates();
      }
    }, [expandedJobId]);

return (
  <div className="min-h-screen bg-gray-50 mt-16">
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Job Portal
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Post New Job
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Requirements
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) =>
                        handleArrayInputChange(
                          index,
                          "requirements",
                          e.target.value
                        )
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField("requirements", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("requirements")}
                  className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Requirement
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tech Stack
                </label>
                {formData.techStack.map((tech, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) =>
                        handleArrayInputChange(
                          index,
                          "techStack",
                          e.target.value
                        )
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField("techStack", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("techStack")}
                  className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <PlusCircle className="w-4 h-4" /> Add Tech Stack
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {job.role}
                  </h3>
                  <p className="text-gray-600 font-medium mt-1">
                    {job.company}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Edit className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-700" />
                  <Trash2 className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-700" />
                  <button
                    onClick={() => job._id && toggleApplications(job._id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Users className="w-5 h-5" />
                    View Applications
                    {expandedJobId === job._id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {job.salary}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <BookOpen className="w-4 h-4 mr-2 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">Requirements</h4>
                </div>
                <ul className="list-disc list-inside text-gray-600 ml-6">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Code className="w-4 h-4 mr-2 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">Tech Stack</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {expandedJobId === job._id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Applications
                  </h4>
                  {candidates[job._id]?.length > 0 ? (
                    <div className="space-y-4">
                      {candidates[job._id].map((candidate, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {candidate.name}
                              </h5>
                              <p className="text-gray-600">{candidate.email}</p>
                              <p className="text-gray-600">{candidate.phone}</p>
                            </div>
                            <a
                              href={candidate.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              View Resume <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-md">
                      No applications received yet for this position.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);
};

export default JobPortal;

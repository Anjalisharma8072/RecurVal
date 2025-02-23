import { MapPin, DollarSign, Book, Code, ExternalLink, X } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ApplicationModal = ({ isOpen, onClose, jobTitle, jobId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
    appliedJob: jobId, 
  });

  useEffect(() => {
    console.log("Job ID:", jobId); 
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Application:", {
      jobId,
      ...formData,
    });

    try {
      const response = await fetch("http://localhost:8080/api/job-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          ...formData,
        }),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "", 
          resumeLink: "",
          appliedJob: jobId,
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Apply for {jobTitle}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 focus:ring-blue-500">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link
            </label>
            <input
              type="url"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="url"
            />
          </div>

          <button
            type="submit"
            onClick="handleSubmit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

ApplicationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jobTitle: PropTypes.string,
  jobId: PropTypes.string,
};

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const getjobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/job-list", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    getjobs();
  }, []);

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
          <p className="text-gray-600 font-medium mt-1">{job.company}</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center gap-2"
          onClick={() => {
            setSelectedJob(job);
            setIsModalOpen(true);
          }}
        >
          Apply Now
          <ExternalLink className="w-4 h-4" />
        </button>
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
          <Book className="w-4 h-4 mr-2 text-gray-700" />
          <h4 className="font-semibold text-gray-900">Requirements</h4>
        </div>
        <ul className="list-disc list-inside text-gray-600 ml-6">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div>
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
    </div>
  );

  JobCard.propTypes = {
    job: PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      salary: PropTypes.string.isRequired,
      requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
      techStack: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tech Job Openings
          </h1>
          <p className="text-xl text-gray-600">
            Find your next opportunity in tech
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
          jobTitle={selectedJob?.role}
          jobId={selectedJob?._id}
        />
      </div>
    </div>
  );
};

export default JobListings;

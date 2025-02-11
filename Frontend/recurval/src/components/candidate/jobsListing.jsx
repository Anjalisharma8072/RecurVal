import {

  MapPin,
  DollarSign,
  Book,
  Code,
  ExternalLink,
} from "lucide-react";
import {useState,useEffect} from "react";
import PropTypes from "prop-types";

const JobListings = ()=>{
  const [jobs, setJobs] = useState([]);
 useEffect(()=>{
    const getjobs = async()=>{
      try{
        const response = await fetch("http://localhost:8000/api/job-list",{
          method:"GET",
          headers:{"Content-Type":"application/json"},
        })
        const data = await response.json();
        console.log("data",data);
        
        setJobs(data)
      }catch(error){
        console.log("error",error)
      }
    }
    getjobs()
  },[])

  
  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
          <p className="text-gray-600 font-medium mt-1">{job.company}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
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
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
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
        </div>
      </div>
    );
  };





export default JobListings;

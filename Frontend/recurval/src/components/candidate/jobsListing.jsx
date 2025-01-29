import {

  MapPin,
  Clock,
  DollarSign,
  Book,
  Code,
  ExternalLink,
} from "lucide-react";
import PropTypes from "prop-types";
const jobs = [
  {
    id: 1,
    role: "Senior Frontend Developer",
    company: "TechVision Labs",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    requirements: [
      "5+ years React experience",
      "Strong TypeScript skills",
      "CI/CD knowledge",
      "Team leadership",
    ],
    techStack: ["React", "TypeScript", "Next.js", "GraphQL"],
  },
  {
    id: 2,
    role: "AI Research Engineer",
    company: "Neural Dynamics",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150,000 - $200,000",
    requirements: [
      "PhD in ML/AI",
      "PyTorch expertise",
      "Research publication history",
      "Python mastery",
    ],
    techStack: ["Python", "PyTorch", "TensorFlow", "CUDA"],
  },
  {
    id: 3,
    role: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Hybrid - Seattle, WA",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    requirements: [
      "AWS certification",
      "Kubernetes expertise",
      "Infrastructure as Code",
      "Monitoring systems",
    ],
    techStack: ["Docker", "Kubernetes", "Terraform", "AWS"],
  },
  {
    id: 4,
    role: "UI/UX Designer",
    company: "DesignCraft Studio",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    requirements: [
      "3+ years UI/UX experience",
      "Strong portfolio",
      "User research skills",
      "Prototyping",
    ],
    techStack: ["Figma", "Adobe XD", "Sketch", "InVision"],
  },
  {
    id: 5,
    role: "Blockchain Developer",
    company: "CryptoTech Solutions",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$140,000 - $180,000",
    requirements: [
      "Smart contract development",
      "DeFi experience",
      "Solidity expertise",
      "Web3 knowledge",
    ],
    techStack: ["Solidity", "Web3.js", "Ethereum", "React"],
  },
  {
    id: 6,
    role: "Data Scientist",
    company: "DataMinds Analytics",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$125,000 - $165,000",
    requirements: [
      "ML modeling experience",
      "Statistical analysis",
      "Data visualization",
      "SQL mastery",
    ],
    techStack: ["Python", "R", "TensorFlow", "SQL"],
  },
  {
    id: 7,
    role: "Cloud Solutions Architect",
    company: "CloudPeak Technologies",
    location: "Remote",
    type: "Full-time",
    salary: "$160,000 - $200,000",
    requirements: [
      "Multi-cloud expertise",
      "Solution design",
      "Technical leadership",
      "Architecture patterns",
    ],
    techStack: ["AWS", "Azure", "GCP", "Terraform"],
  },
  {
    id: 8,
    role: "Mobile Developer",
    company: "AppCraft Mobile",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    requirements: [
      "iOS/Android development",
      "Cross-platform exp",
      "API integration",
      "App Store deployment",
    ],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    id: 9,
    role: "Cybersecurity Analyst",
    company: "SecureGuard Systems",
    location: "Washington, DC",
    type: "Full-time",
    salary: "$115,000 - $155,000",
    requirements: [
      "Security certifications",
      "Threat analysis",
      "Incident response",
      "Security tools",
    ],
    techStack: ["Python", "Wireshark", "Nmap", "Metasploit"],
  },
  {
    id: 10,
    role: "Full Stack Engineer",
    company: "FullStack Solutions",
    location: "Remote",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    requirements: [
      "Full stack development",
      "API design",
      "Database modeling",
      "Cloud services",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
];

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
        <Clock className="w-4 h-4 mr-2" />
        {job.type}
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

const JobListings = () => {
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

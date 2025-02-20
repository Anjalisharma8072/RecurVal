import { ArrowRight, Search, Calendar, Users } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform -rotate-45 left-1/2 top-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-64 w-64 border-2 border-blue-600 rounded-full absolute"
                style={{ left: `${i * 100}px`, top: `${i * 100}px` }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-70">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                Your Dream Job Interview
                <span className="block text-blue-600">
                  Is Just A Click Away
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Streamline your job search and interview process with our
                intelligent platform that connects talent with opportunities
              </p>
            </div>

            <div className="flex justify-center space-x-6">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center transform transition hover:scale-105">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transform transition hover:scale-105">
                For Employers
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
            <p className="text-gray-600">
              Find the perfect job opportunities matched to your skills and
              experience
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seamless Scheduling</h3>
            <p className="text-gray-600">
              Schedule interviews with ease using our integrated calendar system
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Virtual Interviews</h3>
            <p className="text-gray-600">
              Conduct smooth online interviews with our built-in video platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

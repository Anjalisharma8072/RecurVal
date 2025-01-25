import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await doSignOut();
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleNavigate = (path) => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="bg-gray-800 text-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Title */}
        <h1
          className="text-2xl md:text-3xl font-bold cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          Recurval
        </h1>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {userLoggedIn && (
            <div className="flex space-x-4">
              <button
                onClick={() => handleNavigate("/score")}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
              >
                Score
              </button>
              <button
                onClick={() => handleNavigate("/interview")}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
              >
                Interview
              </button>
              <button
                onClick={() => handleNavigate("/meeting-room")}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
              >
                Meeting Room
              </button>
            </div>
          )}

          {/* Profile/Auth Section */}
          <div className="relative">
            {userLoggedIn ? (
              <div>
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-400 flex items-center justify-center focus:outline-none"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-gray-800 text-gray-700 rounded-lg shadow-lg w-48 border border-gray-700">
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-white transition duration-300"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 hover:text-white transition duration-300"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 pt-4 pb-6 px-4">
            {userLoggedIn && (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleNavigate("/score")}
                  className="text-gray-200 hover:text-white px-4 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
                >
                  Score
                </button>
                <button
                  onClick={() => handleNavigate("/interview")}
                  className="text-gray-200 hover:text-white px-4 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
                >
                  Interview
                </button>
                <button
                  onClick={() => handleNavigate("/meeting-room")}
                  className="text-gray-200 hover:text-white px-4 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
                >
                  Meeting Room
                </button>
              </div>
            )}

            {/* Mobile Profile/Auth Section */}
            <div className="mt-4">
              {userLoggedIn ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="w-full text-left text-gray-200 hover:text-white px-4 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-200 hover:text-white px-4 py-2 rounded-lg transition duration-300 bg-gray-700 hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

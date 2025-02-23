import  { useState } from "react";
import { Edit2, Save, Upload } from "lucide-react";

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
    profilePhoto: null,
  });

  const [previewPhoto, setPreviewPhoto] = useState("/api/placeholder/150/150");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
      setProfileData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="  bg-gradient-to-br from-blue-50 to-blue-100 py-16 ">
      <div className="max-w-2xl mx-auto bg-white  p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Profile Information
          </h1>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save size={18} />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit2 size={18} />
                <span>Edit</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewPhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
            </div>
            {!profileData.profilePhoto && !isEditing && (
              <p className="text-gray-500">No profile photo uploaded</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="p-2 text-gray-600">
                  {profileData.name || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="p-2 text-gray-600">
                  {profileData.email || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="p-2 text-gray-600">
                  {profileData.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume Link
              </label>
              {isEditing ? (
                <input
                  type="url"
                  name="resumeLink"
                  value={profileData.resumeLink}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your resume link"
                />
              ) : (
                <p className="p-2 text-gray-600">
                  {profileData.resumeLink ? (
                    <a
                      href={profileData.resumeLink}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;

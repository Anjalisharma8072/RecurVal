import { useState } from "react";
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  PhoneIcon,
  PhoneOffIcon,
} from "lucide-react";

const MeetingRoom = () => {
  const [localVideoMuted, setLocalVideoMuted] = useState(false);
  const [localMicMuted, setLocalMicMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  const toggleLocalVideo = () => {
    setLocalVideoMuted(!localVideoMuted);
  };

  const toggleLocalMic = () => {
    setLocalMicMuted(!localMicMuted);
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    // Implement actual call start logic here
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Implement actual call end logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Local Video Interface */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg relative">
            {localVideoMuted ? (
              <div className="w-full h-80 md:h-96 bg-gray-700 flex items-center justify-center text-gray-400">
                Video Muted
              </div>
            ) : (
              <video
                src="/api/placeholder/600/400"
                autoPlay
                loop
                muted
                className="w-full h-80 md:h-96 object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={toggleLocalVideo}
                  className={`p-3 rounded-full ${
                    localVideoMuted ? "bg-red-500" : "bg-gray-700"
                  } text-white`}
                >
                  {localVideoMuted ? <VideoOffIcon /> : <VideoIcon />}
                </button>
                <button
                  onClick={toggleLocalMic}
                  className={`p-3 rounded-full ${
                    localMicMuted ? "bg-red-500" : "bg-gray-700"
                  } text-white`}
                >
                  {localMicMuted ? <MicOffIcon /> : <MicIcon />}
                </button>
              </div>
              <div>
                {isCallActive ? (
                  <button
                    onClick={handleEndCall}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full flex items-center space-x-2 transition duration-300"
                  >
                    <PhoneOffIcon />
                    <span>Hang Up</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartCall}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full flex items-center space-x-2 transition duration-300"
                  >
                    <PhoneIcon />
                    <span>Start Call</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Remote Video Interface */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg relative">
            <video
              src="/api/placeholder/600/400"
              autoPlay
              loop
              muted
              className="w-full h-80 md:h-96 object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <div className="bg-gray-700 text-gray-400 px-4 py-2 rounded-full">
                Remote Participant
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;

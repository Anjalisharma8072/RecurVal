import  { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/contexts/socketProvider";
import { Camera, UserRoundCheck, ArrowRight } from "lucide-react";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/room/${room}`, { state: { email, room } });
    },
    [email,navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row animate-fade-in">
        {/* Side Image Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-blue-600 opacity-20 animate-pulse"
            style={{
              backgroundImage:
                "radial-gradient(circle, transparent 20%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 80%)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="text-center text-white p-8 relative z-10">
            <div className="animate-bounce">
              <Camera
                size={96}
                className="mx-auto mb-4 text-white/80 drop-shadow-lg transform transition-transform hover:scale-110"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Virtual Meetspace
            </h2>
            <p className="text-white/80 mb-6 leading-relaxed text-sm md:text-base">
              Seamless communication starts here. Connect, collaborate, and
              create together.
            </p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`h-3 w-3 rounded-full transition-all duration-500 ${
                    dot === 2 ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 flex items-center">
            <UserRoundCheck className="mr-3 text-blue-500" size={24} />
            Room Entry
          </h1>
          <form
            onSubmit={handleSubmitForm}
            className="space-y-4 md:space-y-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-xs md:text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-xl shadow-sm 
                  focus:outline-none focus:border-blue-500 transition-all 
                  hover:border-blue-300 text-sm md:text-base"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="room"
                className="block text-xs md:text-sm font-medium text-gray-700 mb-2"
              >
                Meeting ID
              </label>
              <input
                type="text"
                id="room"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-xl shadow-sm 
                  focus:outline-none focus:border-blue-500 transition-all 
                  hover:border-blue-300 text-sm md:text-base"
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2.5 md:py-3.5 rounded-xl 
                flex items-center justify-center space-x-2 
                transform transition-all duration-300 
                hover:bg-blue-600 hover:shadow-lg text-sm md:text-base
                ${isHovered ? "hover:-translate-y-1" : ""}`}
            >
              <span>Join Meeting</span>
              <ArrowRight className="ml-2" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;

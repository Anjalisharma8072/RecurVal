import  { useEffect, useCallback, useState,useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/peer";
import { useSocket } from "@/contexts/socketProvider";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";


const RoomPage = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, room } = location.state || {};
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMicOn, setIsMicOn] = useState(false);
  // const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [accumulatedTranscript, setAccumulatedTranscript] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState(null);
  const finalTranscriptRef = useRef("");

  const debounceRef = useRef(
    debounce((transcript) => {
      const newText = transcript.slice(finalTranscriptRef.current.length);
      if (newText.trim()) {
        setAccumulatedTranscript((prev) => `${prev} ${newText.trim()}`.trim());
        finalTranscriptRef.current = transcript;
      }
    }, 800) // Increased debounce time for better finalization
  );

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

 
  const toggleMic = () => {
    if (!isMicOn) {
      finalTranscriptRef.current = "";
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: false, // Get only final results
      });
      setIsMicOn(true);
    } else {
      SpeechRecognition.stopListening();
      setIsMicOn(false);

      // Send any remaining text immediately
      debounceRef.current.flush();
      if (accumulatedTranscript) {
        socket.emit("message:send", {
          room,
          message: accumulatedTranscript,
          email,
        });
        setAccumulatedTranscript("");
      }
      resetTranscript();
      finalTranscriptRef.current = "";
    }
  };
  const handleEndMeeting = async () => {
    console.log("host Meeting Ended");
    messages.forEach((msg) => {
      console.log(`${msg.email}: ${msg.content}`);
    });
    // Stop media streams
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    socket.emit("meeting:end", { room });

    const evaulation = await evaluateCandidate(messages);
    setEvaluationResult(evaulation);
    console.log("----", email);

    // Redirect to meeting entry URL
    navigate("/score", {
      state: { evaluationResult: evaulation, candidateEmail: candidateEmail },
    });
  };

  const evaluateCandidate = async (messages) => {
    try {
      const response = await fetch(`${API_BASE_URL}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
      const result = await response.json();
      console.log("AI Responsee:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setCandidateEmail(email);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  // Handle meeting end from server
  useEffect(() => {
    const handleMeetingEnd = () => {
      console.log("Meeting ended by host");
      if (myStream) myStream.getTracks().forEach((track) => track.stop());
      if (remoteStream)
        remoteStream.getTracks().forEach((track) => track.stop());
      navigate("/meeting-room", { state: { meetingEnded: true } });
    };

    socket.on("call:ended", handleMeetingEnd);
    return () => socket.off("call:ended", handleMeetingEnd);
  }, [socket, navigate, myStream, remoteStream]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("host:status", ({ isHost }) => setIsHost(isHost)); // Listen for host status

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("host:status");
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  useEffect(() => {
    if (room && email) {
      console.log(`Joining room: ${room} as ${email}`);
      socket.emit("join-room", { room, email });
    }

    const handleMessageReceive = ({ email, message }) => {
      console.log(`Received message from ${email}: ${message}`);
      setMessages((prev) => [...prev, { email, content: message }]);
    };

    socket.on("message:receive", handleMessageReceive);

    return () => {
      socket.off("message:receive", handleMessageReceive);
    };
  }, [room, email]);

  // const debouncedTranscriptUpdate = useCallback(
  //   debounce((newTranscript) => {
  //     setAccumulatedTranscript((prev) => `${prev} ${newTranscript}`);
  //     previousTranscriptRef.current = transcript;
  //   }, 500),
  //   []
  // );

    useEffect(() => {
      if (transcript && transcript !== finalTranscriptRef.current) {
        debounceRef.current(transcript);
      }
    }, [transcript]);

    // Cleanup debounce
    useEffect(() => {
      return () => debounceRef.current.cancel();
    }, []);

  //  const sendMessage = () => {
  //    if (message.trim()) {
  //      console.log(`Sending message: ${message} to room: ${room}`);
  //      socket.emit("message:send", { room, message:transcript, email });
  //      setMessage("");
  //    }
  //  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesnt support speech recognition.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-16 pb-4">
      <div className="w-full max-w-7xl mx-4 md:mx-8 lg:mx-12 xl:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Video Conference
            </h1>
            <p className="text-gray-600">
              {remoteSocketId ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                  <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800">
                  Waiting for participants...
                </span>
              )}
            </p>
          </div>

          {/* Transcript Section */}
          <div className="bg-gray-100 rounded-xl p-4 min-h-[150px]">
            <p className="text-gray-700">
              {transcript || "Your transcription will appear here..."}
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {myStream && (
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-gray-700">
                  <h2 className="text-white font-medium">Your Camera</h2>
                </div>
                <ReactPlayer
                  playing
                  muted
                  width="100%"
                  height="auto"
                  style={{ aspectRatio: "16/9" }}
                  className="object-cover"
                  url={myStream}
                />
              </div>
            )}

            {remoteStream && (
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="p-4 bg-gray-700">
                  <h2 className="text-white font-medium">Participant</h2>
                </div>
                <ReactPlayer
                  playing
                  muted
                  width="100%"
                  height="auto"
                  style={{ aspectRatio: "16/9" }}
                  className="object-cover"
                  url={remoteStream}
                />
              </div>
            )}
          </div>
          <div>
            <h1>Chat Room: {room}</h1>
            <div className="chat-box">
              {messages.map((msg, idx) => (
                <p key={idx}>
                  <strong>{msg.email}:</strong> {msg.content}
                </p>
              ))}
            </div>
            {/* <input
              type="text"
              value={transcript}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button> */}
          </div>
          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Mic Toggle Button */}
            <button
              onClick={toggleMic}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md ${
                isMicOn
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isMicOn ? (
                <div className="flex items-center">
                  <Mic className="mr-2" /> Stop Listening
                </div>
              ) : (
                <div className="flex items-center">
                  <MicOff className="mr-2" /> Start Listening
                </div>
              )}
            </button>

            {remoteSocketId && (
              <button
                onClick={handleCallUser}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
              >
                Start Call
              </button>
            )}

            {myStream && sendStreams && (
              <button
                onClick={sendStreams}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
              >
                Share Video
              </button>
            )}
            <button
              onClick={handleEndMeeting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
            >
              End Meeting
            </button>
          </div>
          {evaluationResult && (
            <div className="bg-white rounded-xl shadow-xl p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Evaluation Result
              </h2>
              <pre className="text-gray-700 mt-4">
                {JSON.stringify(evaluationResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
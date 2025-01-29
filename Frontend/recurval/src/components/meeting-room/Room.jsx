import  { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/peer";
import { useSocket } from "../../contexts/socketProvider";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";



const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMicOn, setIsMicOn] = useState(false);

  const {
    transcript,
    // listening,
    // resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const toggleMic = () => {
    if (!isMicOn) {
      // Turn mic on
      SpeechRecognition.startListening({ continuous: true });
      setIsMicOn(true);
    } else {
      // Turn mic off
      SpeechRecognition.stopListening();
      setIsMicOn(false);
    }
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
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

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesnt support speech recognition.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-16 pb-4">
      <div className="w-full max-w-7xl mx-4 md:mx-8 lg:mx-12 xl:mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6">
          {/* Header Section */}
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
                Share Screen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
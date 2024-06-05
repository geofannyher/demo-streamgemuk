"use client";

import React, { useEffect, useRef, useState } from "react";
const PlayVideo: React.FC = () => {
  const video1 =
    "https://res.cloudinary.com/dp8ita8x5/video/upload/v1717566444/videoStream/comhm3zcijnjtk0f02wm.mp4";
  const video2 =
    "https://res.cloudinary.com/dp8ita8x5/video/upload/v1717566116/videoStream/fzqcsqer81sdvl8hiana.mp4";
  const [messages, setMessages] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState(video1);
  const [loadingText, setLoadingText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/subscribeMessage");

    eventSource.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAudioEnded = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioUrl("");
    }
  };

  return (
    <div className="grid grid-cols-3 h-[100dvh]">
      {/* Video Component */}
      <div className="col-span-3 flex items-center justify-center bg-white h-full">
        <div
          style={{
            width: "calc(100dvh * 9 / 16)",
          }}
          className="relative  bg-white flex items-center justify-center"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative">
              {currentVideo && (
                <video
                  key={currentVideo}
                  autoPlay
                  loop
                  muted
                  className={`transition-opacity duration-1000 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onEnded={handleAudioEnded}
                >
                  <source src={currentVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div>Loading...</div>
            </div>
          )}
        </div>
      </div>
      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          // onEnded={handleAudioEnded}
          controls
          className="hidden"
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default PlayVideo;

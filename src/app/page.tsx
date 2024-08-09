"use client";

import React, { useEffect, useRef, useState } from "react";

const PlayVideo: React.FC = () => {
  const videoUrl =
    "https://res.cloudinary.com/dp8ita8x5/video/upload/v1723175258/videoStream/gemuk/fix%20no%20sound.mp4";

  const [audioUrl, setAudioUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const connectToStream = () => {
    const eventSource = new EventSource("/api/subscribeMessage");
    eventSource.addEventListener("message", (event) => {
      console.log("Received message event:", event);
      const newAudioUrl = event.data;
      if (newAudioUrl) {
        setAudioUrl(newAudioUrl);
        if (videoRef.current) {
          videoRef.current.currentTime = 61; // 1 menit 1 detik
          videoRef.current.loop = true;
        }
      } else {
        console.error("Received invalid audio URL");
      }
    });

    eventSource.addEventListener("error", (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
      setTimeout(connectToStream, 1000); // Use 1 second timeout to prevent rapid reconnection attempts
    });

    return eventSource;
  };

  useEffect(() => {
    const eventSource = connectToStream();
    return () => {
      console.log("CLOSED");
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [audioUrl]);

  const handleAudioEnded = () => {
    console.log("Audio ended");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.loop = true;
    }
  };

  const handleAudioCanPlayThrough = () => {
    console.log("Audio can play through");
    if (videoRef.current) {
      videoRef.current.currentTime = 61; // 1 menit 1 detik
      videoRef.current.loop = true;
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      if (audioUrl && videoRef.current.currentTime >= 103) {
        // 1 menit 43 detik
        videoRef.current.currentTime = 61; // 1 menit 1 detik
      } else if (!audioUrl && videoRef.current.currentTime >= 60) {
        // 1 menit
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <div className="grid grid-cols-3 h-[100dvh]">
      <div className="col-span-3 flex items-center justify-center bg-white h-full">
        <div
          style={{
            width: "calc(100dvh * 9 / 16)",
          }}
          className="relative bg-white flex items-center justify-center"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative">
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                onTimeUpdate={handleVideoTimeUpdate}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onCanPlayThrough={handleAudioCanPlayThrough}
          autoPlay
          controls
          // style={{ display: "none" }}
        >
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default PlayVideo;

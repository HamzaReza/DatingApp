import React, { createContext, ReactNode, useContext, useState } from "react";

interface VideoContextType {
  currentlyPlayingId: string | null;
  setCurrentlyPlaying: (videoId: string | null) => void;
  stopAllVideos: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const setCurrentlyPlaying = (videoId: string | null) => {
    setCurrentlyPlayingId(videoId);
  };

  const stopAllVideos = () => {
    setCurrentlyPlayingId(null);
  };

  return (
    <VideoContext.Provider
      value={{
        currentlyPlayingId,
        setCurrentlyPlaying,
        stopAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

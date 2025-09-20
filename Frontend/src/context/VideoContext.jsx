import { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);

  const addVideo = (video) => {
    setVideos((prev) => [video, ...prev]);
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

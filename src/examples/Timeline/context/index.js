import { createContext, useContext } from "react";

// The Timeline main context
const Timeline = createContext();

// Timeline context provider
const TimelineProvider = ({ children, value }) => {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
 

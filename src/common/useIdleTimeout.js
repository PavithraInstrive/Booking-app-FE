import { useState, useEffect } from "react";

const useIdleTimeout = (logoutUser, idleLimit = 10 * 60 * 1000) => {
  const [idleTime, setIdleTime] = useState(0);

  useEffect(() => {
    const idleInterval = setInterval(timerIncrement, 60000); 
    
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onkeypress = resetTimer;
    window.ontouchstart = resetTimer;

    return () => {
      clearInterval(idleInterval);
      window.onload = null;
      window.onmousemove = null;
      window.onkeypress = null;
      window.ontouchstart = null;
    };
  }, [idleTime]);

  const timerIncrement = () => {
    setIdleTime((prev) => prev + 60000); 
    if (idleTime >= idleLimit) {
      logoutUser(); 
    }
  };

  const resetTimer = () => {
    setIdleTime(0);
  };
};

export default useIdleTimeout;

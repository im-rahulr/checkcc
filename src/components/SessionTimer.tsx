import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const SessionTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full animate-pulse"
      data-oid="er7sdnr"
    >
      <Clock className="h-4 w-4 text-green-600" data-oid="-px.21m" />
      <span
        className="font-mono text-green-800 font-semibold"
        data-oid="pw49m7b"
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
};

export default SessionTimer;

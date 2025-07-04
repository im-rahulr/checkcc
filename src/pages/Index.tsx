import { useState, useEffect } from "react";
import TimerInterface from "@/components/TimerInterface";
import GlobalCommunity from "@/components/GlobalCommunity";
import TopNavigation from "@/components/TopNavigation";

const Index = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentUser] = useState({
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg",
    initials: "AC",
  });

  const [sessionData] = useState({
    daysLocked: 0,
    onlineUsers: 10,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const handleWorkToggle = () => {
    setIsWorking(!isWorking);
    if (!isWorking) {
      setSeconds(0);
    }
    console.log(
      `${isWorking ? "Stopping" : "Starting"} work session for ${currentUser.name}`,
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://www.baltana.com/files/wallpapers-25/Minimalist-Dark-Wallpaper-1920x1080-65049.jpg')`,
      }}
      data-oid="apytp-u"
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" data-oid="ct:e6rs"></div>

      {/* Content */}
      <div
        className="relative z-10 min-h-screen flex flex-col"
        data-oid="t9hthax"
      >
        {/* Top Navigation */}
        <TopNavigation
          currentUser={currentUser}
          daysLocked={sessionData.daysLocked}
          onlineUsers={sessionData.onlineUsers}
          data-oid="v8j2hhn"
        />

        {/* Main Content */}
        <div
          className="flex-1 flex items-center justify-center px-4"
          data-oid="sva7s4w"
        >
          <div className="w-full max-w-4xl" data-oid="k5n858m">
            {/* Central Timer Interface */}
            <TimerInterface
              isWorking={isWorking}
              seconds={seconds}
              onToggle={handleWorkToggle}
              data-oid="2vl5sli"
            />
          </div>
        </div>

        {/* Right Side Panel - Global Community */}
        <GlobalCommunity data-oid="e2qn0ne" />
      </div>
    </div>
  );
};

export default Index;

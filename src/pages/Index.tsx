
import { useState, useEffect } from "react";
import TimerInterface from "@/components/TimerInterface";
import GlobalCommunity from "@/components/GlobalCommunity";
import TopNavigation from "@/components/TopNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useTimerSessions } from "@/hooks/useTimerSessions";
import { useUserPresence } from "@/hooks/useUserPresence";

const Index = () => {
  const { user } = useAuth();
  const { createSession, endSession, totalMinutes } = useTimerSessions();
  const { onlineCount } = useUserPresence();
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Calculate days locked (simplified - could be enhanced with actual streak logic)
  const daysLocked = Math.floor(totalMinutes / (8 * 60)); // Assuming 8 hours = 1 day

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const handleWorkToggle = async () => {
    if (!isWorking) {
      // Starting a new session
      const session = await createSession();
      if (session) {
        setCurrentSessionId(session.id);
        setIsWorking(true);
        setSeconds(0);
        console.log(`Starting work session for ${user?.email}`);
      }
    } else {
      // Pausing current session
      setIsWorking(false);
      console.log(`Pausing work session for ${user?.email}`);
    }
  };

  const handleReset = () => {
    setIsWorking(false);
    setSeconds(0);
    setCurrentSessionId(null);
  };

  const handleComplete = async () => {
    if (currentSessionId && seconds > 0) {
      const durationMinutes = Math.floor(seconds / 60);
      await endSession(currentSessionId, durationMinutes);
      
      // Reset timer after completing session
      setIsWorking(false);
      setSeconds(0);
      setCurrentSessionId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://www.baltana.com/files/wallpapers-25/Minimalist-Dark-Wallpaper-1920x1080-65049.jpg')`,
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <TopNavigation
          currentUser={{
            id: 1,
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Focus Master',
            avatar: "/placeholder.svg",
            initials: (user?.user_metadata?.full_name || user?.email || 'FM')
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
          }}
          daysLocked={daysLocked}
          onlineUsers={onlineCount}
        />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* Central Timer Interface */}
            <TimerInterface
              isWorking={isWorking}
              seconds={seconds}
              onToggle={handleWorkToggle}
              onReset={handleReset}
              onComplete={handleComplete}
            />
          </div>
        </div>

        {/* Right Side Panel - Global Community */}
        <GlobalCommunity />
      </div>
    </div>
  );
};

export default Index;

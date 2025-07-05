
import { useState, useEffect } from "react";
import TimerInterface from "@/components/TimerInterface";
import GlobalCommunity from "@/components/GlobalCommunity";
import TopNavigation from "@/components/TopNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useTimerSessions } from "@/hooks/useTimerSessions";
import { useUserPresence } from "@/hooks/useUserPresence";
import { useTimer } from "@/contexts/TimerContext";

const Index = () => {
  const { user } = useAuth();
  const { totalMinutes } = useTimerSessions();
  const { onlineCount } = useUserPresence();
  const { isWorking, seconds, onToggle, onReset, onComplete } = useTimer();
  const [showCommunity, setShowCommunity] = useState(false);

  // Calculate days locked (simplified - could be enhanced with actual streak logic)
  const daysLocked = Math.floor(totalMinutes / (8 * 60)); // Assuming 8 hours = 1 day

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{
        backgroundImage: `url('https://i.pinimg.com/originals/41/2a/78/412a78098d247e244cd3612296ec2be1.gif')`,
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <TopNavigation
          currentUser={{
            id: 1,
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Focus Master',
            avatar: user?.user_metadata?.avatar_url || "",
            initials: (user?.user_metadata?.full_name || user?.email || 'FM')
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
          }}
          daysLocked={daysLocked}
          onlineUsers={onlineCount}
          onShowCommunity={() => setShowCommunity(true)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-end px-4 pb-16">
          <div className="w-full max-w-2xl mx-auto">
            {/* Bottom Timer Interface */}
            <TimerInterface
              isWorking={isWorking}
              seconds={seconds}
              onToggle={onToggle}
              onReset={onReset}
              onComplete={onComplete}
            />
          </div>
        </div>

        {/* Right Side Panel - Global Community */}
        {showCommunity && <GlobalCommunity onClose={() => setShowCommunity(false)} />}
      </div>
    </div>
  );
};

export default Index;

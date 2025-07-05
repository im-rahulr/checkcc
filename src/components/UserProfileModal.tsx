import React, { useState, useEffect } from "react";
import { X, Clock, Calendar, Award, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

interface UserProfileModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

interface TimerSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, userName, onClose }) => {
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [monthMinutes, setMonthMinutes] = useState(0);
  const [averageSession, setAverageSession] = useState(0);
  const [longestSession, setLongestSession] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', false) // Only completed sessions
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching user sessions:', sessionsError);
        return;
      }

      // Fetch total minutes
      const { data: totalMinutesData, error: totalMinutesError } = await supabase
        .rpc('get_user_total_minutes', { user_uuid: userId });

      if (totalMinutesError) {
        console.error('Error fetching total minutes:', totalMinutesError);
        // Calculate total minutes from sessions data as fallback
        const totalFromSessions = (sessionsData || [])
          .filter(s => s.end_time && s.duration_minutes)
          .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        setTotalMinutes(totalFromSessions);
      } else {
        setTotalMinutes(totalMinutesData || 0);
      }

      setSessions(sessionsData || []);
      
      if (sessionsData && sessionsData.length > 0) {
        calculateStats(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionsData: TimerSession[]) => {
    const completedSessions = sessionsData.filter(s => s.end_time && s.duration_minutes);
    
    // Today's minutes
    const todayTotal = completedSessions
      .filter(s => isToday(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // This week's minutes
    const weekTotal = completedSessions
      .filter(s => isThisWeek(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // This month's minutes
    const monthTotal = completedSessions
      .filter(s => isThisMonth(new Date(s.created_at)))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    
    // Average session length
    const avgSession = completedSessions.length > 0 
      ? Math.round(completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / completedSessions.length)
      : 0;
    
    // Longest session
    const longest = completedSessions.length > 0 
      ? Math.max(...completedSessions.map(s => s.duration_minutes || 0))
      : 0;

    setTodayMinutes(todayTotal);
    setWeekMinutes(weekTotal);
    setMonthMinutes(monthTotal);
    setAverageSession(avgSession);
    setLongestSession(longest);
    setTotalSessions(completedSessions.length);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-purple-500 text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white text-xl font-bold">{userName}</h2>
              <p className="text-white/60">Profile & Timer Stats</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-white/60">Loading user data...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-white/60 text-sm">Today</p>
                      <p className="text-white text-lg font-bold">{formatTime(todayMinutes)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-white/60 text-sm">This Week</p>
                      <p className="text-white text-lg font-bold">{formatTime(weekMinutes)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-white/60 text-sm">This Month</p>
                      <p className="text-white text-lg font-bold">{formatTime(monthMinutes)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-white/60 text-sm">All Time</p>
                      <p className="text-white text-lg font-bold">{formatTime(totalMinutes)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Total Sessions</span>
                    <span className="text-white font-bold">{totalSessions}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Average Session</span>
                    <span className="text-white font-bold">{formatTime(averageSession)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Longest Session</span>
                    <span className="text-white font-bold">{formatTime(longestSession)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sessions.slice(0, 10).map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-white/60" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              {formatTime(session.duration_minutes || 0)}
                            </p>
                            <p className="text-white/60 text-xs">
                              {format(new Date(session.created_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          Completed
                        </Badge>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <p className="text-white/60 text-sm text-center py-4">
                        No sessions found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;

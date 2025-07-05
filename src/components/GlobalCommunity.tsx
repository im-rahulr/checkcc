
import { useState, useEffect } from "react";
import { X, Users, Code, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface OnlineUser {
  id: string;
  email: string;
  full_name?: string;
  last_seen: string;
  total_minutes: number;
}

const GlobalCommunity = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchOnlineUsers = async () => {
      try {
        // First get online users
        const { data: onlineUsersData, error: onlineError } = await supabase
          .from('online_users')
          .select('user_id, last_seen')
          .order('last_seen', { ascending: false });

        if (onlineError) {
          console.error('Error fetching online users:', onlineError);
          return;
        }

        if (!onlineUsersData || onlineUsersData.length === 0) {
          setOnlineUsers([]);
          setActiveCount(0);
          return;
        }

        // Get user IDs to fetch profiles
        const userIds = onlineUsersData.map(user => user.user_id);

        // Fetch profiles for online users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Combine online users with their profiles and get total minutes
        const usersWithMinutes = await Promise.all(
          onlineUsersData.map(async (onlineUser) => {
            const profile = profilesData?.find(p => p.id === onlineUser.user_id);
            
            // Fetch total minutes for each user
            const { data: totalMinutes } = await supabase
              .rpc('get_user_total_minutes', { user_uuid: onlineUser.user_id });

            return {
              id: onlineUser.user_id,
              email: profile?.email || 'Unknown',
              full_name: profile?.full_name,
              last_seen: onlineUser.last_seen,
              total_minutes: totalMinutes || 0
            };
          })
        );

        setOnlineUsers(usersWithMinutes);
        setActiveCount(usersWithMinutes.length);
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };

    fetchOnlineUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel('global-community')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getDisplayName = (name: string | undefined, email: string) => {
    return name || email.split('@')[0];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 backdrop-blur-md bg-black/30 rounded-xl border border-white/10">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-white/80" />
            <h3 className="text-white font-semibold">Global Community</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-white/60 text-sm mb-4">
          {activeCount} active now
        </p>

        {/* Tabs */}
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-0">
            <TabsTrigger
              value="online"
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Online Now
            </TabsTrigger>
            <TabsTrigger
              value="top"
              className="text-white/80 data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              Top Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-4">
            <div className="space-y-3">
              {onlineUsers.length === 0 ? (
                <p className="text-white/60 text-sm text-center py-4">
                  No users online right now
                </p>
              ) : (
                onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {getInitials(user.full_name || '', user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1">
                            <Badge className="bg-green-500 text-white text-xs px-1 py-0 h-5 min-w-0">
                              🟢
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {getDisplayName(user.full_name, user.email)}
                          </p>
                          <p className="text-white/60 text-xs">
                            {formatTime(user.total_minutes)} total
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 ml-11">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-white/60 text-xs">
                            Focus Session
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Code className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400 text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="top" className="mt-4">
            <div className="space-y-3">
              {onlineUsers
                .sort((a, b) => b.total_minutes - a.total_minutes)
                .slice(0, 10)
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-white/60 font-bold">
                          #{index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-purple-500 text-white text-xs">
                            {getInitials(user.full_name || '', user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {getDisplayName(user.full_name, user.email)}
                          </p>
                          <p className="text-white/60 text-xs">
                            {formatTime(user.total_minutes)} total
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-orange-500 text-white text-xs">
                        🏆
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GlobalCommunity;

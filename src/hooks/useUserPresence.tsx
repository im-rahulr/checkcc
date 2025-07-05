
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useUserPresence() {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Update user presence when component mounts
    const updatePresence = async () => {
      try {
        await supabase.rpc('update_user_presence', { user_uuid: user.id });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    updatePresence();

    // Set up interval to update presence every 30 seconds
    const presenceInterval = setInterval(updatePresence, 30000);

    // Set up realtime subscription to track online users count
    const channel = supabase
      .channel('online-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'online_users'
        },
        async () => {
          // Fetch updated count when changes occur
          const { count } = await supabase
            .from('online_users')
            .select('*', { count: 'exact', head: true });
          setOnlineCount(count || 0);
        }
      )
      .subscribe();

    // Initial count fetch
    const fetchOnlineCount = async () => {
      const { count } = await supabase
        .from('online_users')
        .select('*', { count: 'exact', head: true });
      setOnlineCount(count || 0);
    };
    fetchOnlineCount();

    // Cleanup function
    return () => {
      clearInterval(presenceInterval);
      supabase.removeChannel(channel);
      
      // Remove user from online users when unmounting
      if (user) {
        supabase
          .from('online_users')
          .delete()
          .eq('user_id', user.id)
          .then(() => console.log('User presence removed'));
      }
    };
  }, [user]);

  return { onlineCount };
}


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface TimerSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export function useTimerSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load timer sessions.',
          variant: 'destructive',
        });
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalMinutes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_total_minutes', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching total minutes:', error);
      } else {
        setTotalMinutes(data || 0);
      }
    } catch (error) {
      console.error('Error fetching total minutes:', error);
    }
  };

  const createSession = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert({
          user_id: user.id,
          start_time: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        toast({
          title: 'Error',
          description: 'Failed to start timer session.',
          variant: 'destructive',
        });
        return null;
      }

      await fetchSessions();
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const endSession = async (sessionId: string, durationMinutes: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('timer_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_minutes: durationMinutes,
          is_active: false,
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error ending session:', error);
        toast({
          title: 'Error',
          description: 'Failed to save timer session.',
          variant: 'destructive',
        });
      } else {
        await fetchSessions();
        await fetchTotalMinutes();
        toast({
          title: 'Session saved',
          description: `Great work! You focused for ${durationMinutes} minutes.`,
        });
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
      fetchTotalMinutes();
    }
  }, [user]);

  return {
    sessions,
    totalMinutes,
    loading,
    createSession,
    endSession,
    fetchSessions,
    fetchTotalMinutes,
  };
}

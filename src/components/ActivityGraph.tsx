import React, { useState, useMemo } from 'react';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityData {
  date: Date;
  minutes: number;
  sessions: number;
}

interface ActivityGraphProps {
  sessions: Array<{
    id: string;
    created_at: string;
    duration_minutes: number;
    end_time: string | null;
  }>;
}

const ActivityGraph: React.FC<ActivityGraphProps> = ({ sessions }) => {
  const [hoveredCell, setHoveredCell] = useState<ActivityData | null>(null);

  // Generate activity data for the last year (52 weeks)
  const activityData = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return [];
    }

    const today = new Date();
    const startDate = subDays(today, 364); // 52 weeks * 7 days - 1
    const data: ActivityData[] = [];

    // Create data for each day
    for (let i = 0; i < 365; i++) {
      const currentDate = addDays(startDate, i);
      const dayMinutes = sessions
        .filter(session => {
          if (!session.end_time || !session.duration_minutes) return false;
          try {
            const sessionDate = new Date(session.created_at);
            return isSameDay(sessionDate, currentDate);
          } catch (error) {
            console.warn('Invalid date in session:', session.created_at);
            return false;
          }
        })
        .reduce((sum, session) => sum + (session.duration_minutes || 0), 0);

      const daySessions = sessions
        .filter(session => {
          if (!session.end_time || !session.duration_minutes) return false;
          try {
            const sessionDate = new Date(session.created_at);
            return isSameDay(sessionDate, currentDate);
          } catch (error) {
            console.warn('Invalid date in session:', session.created_at);
            return false;
          }
        }).length;

      data.push({
        date: currentDate,
        minutes: dayMinutes,
        sessions: daySessions
      });
    }

    return data;
  }, [sessions]);

  // Get intensity level for color coding
  const getIntensityLevel = (minutes: number) => {
    if (minutes === 0) return 0;
    if (minutes < 30) return 1;
    if (minutes < 60) return 2;
    if (minutes < 120) return 3;
    return 4;
  };

  // Get color class based on intensity
  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800/50 border-gray-700';
      case 1: return 'bg-green-900/60 border-green-800';
      case 2: return 'bg-green-700/70 border-green-600';
      case 3: return 'bg-green-500/80 border-green-400';
      case 4: return 'bg-green-400 border-green-300';
      default: return 'bg-gray-800/50 border-gray-700';
    }
  };

  // Group data by weeks
  const weeks = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return [];
    }

    const weekGroups: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];

    // Start from the beginning of the week containing our start date
    const startDate = startOfWeek(activityData[0]?.date || new Date());

    // Add empty cells for days before our data starts
    const firstDataDate = activityData[0]?.date;
    if (firstDataDate) {
      const daysBefore = Math.max(0, Math.floor((firstDataDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      for (let i = 0; i < daysBefore; i++) {
        currentWeek.push({
          date: addDays(startDate, i),
          minutes: 0,
          sessions: 0
        });
      }
    }

    // Add actual data
    activityData.forEach((day, index) => {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weekGroups.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Add remaining days to complete the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        const lastDate = currentWeek[currentWeek.length - 1]?.date || new Date();
        currentWeek.push({
          date: addDays(lastDate, 1),
          minutes: 0,
          sessions: 0
        });
      }
      weekGroups.push(currentWeek);
    }

    return weekGroups;
  }, [activityData]);

  const formatTooltip = (data: ActivityData) => {
    const dateStr = format(data.date, 'MMM dd, yyyy');
    if (data.minutes === 0) {
      return `No activity on ${dateStr}`;
    }
    const hours = Math.floor(data.minutes / 60);
    const mins = data.minutes % 60;
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    return `${timeStr} on ${dateStr} (${data.sessions} session${data.sessions !== 1 ? 's' : ''})`;
  };

  // Month labels
  const monthLabels = useMemo(() => {
    if (!weeks || weeks.length === 0) {
      return [];
    }

    const labels: { month: string; weekIndex: number }[] = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const monthDate = subDays(today, (11 - i) * 30);
      const weekIndex = Math.floor(i * 4.33); // Approximate weeks per month
      labels.push({
        month: format(monthDate, 'MMM'),
        weekIndex: Math.min(weekIndex, Math.max(0, weeks.length - 1))
      });
    }

    return labels;
  }, [weeks.length]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Show loading/empty state if no data
  if (!activityData || activityData.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg mb-2">Activity Graph</h3>
          <p className="text-white/60 text-sm">No session data available</p>
        </div>
        <div className="flex items-center justify-center h-32 text-white/40">
          <p>Start tracking your sessions to see your activity graph!</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="bg-white/5 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg mb-2">Activity Graph</h3>
          <p className="text-white/60 text-sm">
            {activityData.reduce((sum, day) => sum + day.sessions, 0)} sessions in the last year
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-8"></div> {/* Space for day labels */}
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-white/60 text-xs"
                  style={{ 
                    marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0)) * 12}px`,
                    minWidth: '24px'
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            {/* Graph grid */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col mr-2">
                {dayLabels.map((day, index) => (
                  <div
                    key={day}
                    className="h-3 flex items-center text-white/60 text-xs"
                    style={{ marginBottom: '2px' }}
                  >
                    {index % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Activity grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => {
                      const intensity = getIntensityLevel(day.minutes);
                      const colorClass = getColorClass(intensity);
                      
                      return (
                        <Tooltip key={`${weekIndex}-${dayIndex}`}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-3 h-3 rounded-sm border cursor-pointer transition-all duration-200 hover:scale-110 ${colorClass}`}
                              onMouseEnter={() => setHoveredCell(day)}
                              onMouseLeave={() => setHoveredCell(null)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{formatTooltip(day)}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-white/60 text-xs">
                Less
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm border ${getColorClass(level)}`}
                  />
                ))}
              </div>
              <div className="text-white/60 text-xs">
                More
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ActivityGraph;

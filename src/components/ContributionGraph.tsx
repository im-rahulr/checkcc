
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ContributionGraph = () => {
  // Generate mock data for contribution graph (similar to GitHub)
  const generateContributionData = (weeks: number) => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * 7));

    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        
        // Generate random contribution levels (0-4)
        const level = Math.floor(Math.random() * 5);
        const hours = level * Math.random() * 3; // 0-12 hours
        
        weekData.push({
          date: currentDate.toISOString().split('T')[0],
          level,
          hours: parseFloat(hours.toFixed(1)),
          day: currentDate.getDay()
        });
      }
      data.push(weekData);
    }
    return data;
  };

  const weeklyData = generateContributionData(12); // 3 months
  const monthlyData = generateContributionData(52); // 12 months

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-gray-100',
      'bg-green-100',
      'bg-green-300',
      'bg-green-500',
      'bg-green-700'
    ];
    return colors[level];
  };

  const ContributionChart = ({ data, timeframe }: { data: any[], timeframe: string }) => {
    const totalHours = data.flat().reduce((sum, day) => sum + day.hours, 0);
    const avgDaily = totalHours / data.flat().length;
    const maxStreak = calculateMaxStreak(data.flat());

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">{totalHours.toFixed(1)}h</span> total
          </div>
          <div>
            <span className="font-medium text-gray-900">{avgDaily.toFixed(1)}h</span> daily average
          </div>
          <div>
            <span className="font-medium text-gray-900">{maxStreak}</span> day max streak
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {data.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day: any, dayIndex: number) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getContributionColor(day.level)} hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                    title={`${day.date}: ${day.hours}h worked`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  const calculateMaxStreak = (data: any[]) => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    data.forEach(day => {
      if (day.hours > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Activity Dashboard
          <Badge variant="secondary" className="text-xs">Your Progress</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">12 Weeks</TabsTrigger>
            <TabsTrigger value="monthly">12 Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-6">
            <ContributionChart data={weeklyData} timeframe="weekly" />
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-6">
            <ContributionChart data={monthlyData} timeframe="monthly" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContributionGraph;

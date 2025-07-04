import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContributionGraph = () => {
  // Generate mock data for contribution graph (similar to GitHub)
  const generateContributionData = (weeks: number) => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - weeks * 7);

    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        // Generate random contribution levels (0-4)
        const level = Math.floor(Math.random() * 5);
        const hours = level * Math.random() * 3; // 0-12 hours

        weekData.push({
          date: currentDate.toISOString().split("T")[0],
          level,
          hours: parseFloat(hours.toFixed(1)),
          day: currentDate.getDay(),
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
      "bg-gray-100",
      "bg-green-100",
      "bg-green-300",
      "bg-green-500",
      "bg-green-700",
    ];

    return colors[level];
  };

  const ContributionChart = ({
    data,
    timeframe,
  }: {
    data: any[];
    timeframe: string;
  }) => {
    const totalHours = data.flat().reduce((sum, day) => sum + day.hours, 0);
    const avgDaily = totalHours / data.flat().length;
    const maxStreak = calculateMaxStreak(data.flat());

    return (
      <div className="space-y-4" data-oid="-50ji3v">
        <div
          className="flex flex-wrap gap-4 text-sm text-gray-600"
          data-oid="sr5lp54"
        >
          <div data-oid="rdgs.qj">
            <span className="font-medium text-gray-900" data-oid="pj7uqs5">
              {totalHours.toFixed(1)}h
            </span>{" "}
            total
          </div>
          <div data-oid="iqtmvfh">
            <span className="font-medium text-gray-900" data-oid="kykpzsj">
              {avgDaily.toFixed(1)}h
            </span>{" "}
            daily average
          </div>
          <div data-oid="565jx0r">
            <span className="font-medium text-gray-900" data-oid="m59.49w">
              {maxStreak}
            </span>{" "}
            day max streak
          </div>
        </div>

        <div className="overflow-x-auto" data-oid="qxek7xi">
          <div className="flex gap-1 min-w-max" data-oid="3foqrfv">
            {data.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col gap-1"
                data-oid="j4xfotx"
              >
                {week.map((day: any, dayIndex: number) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getContributionColor(day.level)} hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                    title={`${day.date}: ${day.hours}h worked`}
                    data-oid="2wrh9ai"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between text-xs text-gray-500"
          data-oid="nst_l27"
        >
          <span data-oid="3zwlry8">Less</span>
          <div className="flex gap-1" data-oid="ofiy9e.">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
                data-oid="hwif:s1"
              />
            ))}
          </div>
          <span data-oid="sobjy9w">More</span>
        </div>
      </div>
    );
  };

  const calculateMaxStreak = (data: any[]) => {
    let maxStreak = 0;
    let currentStreak = 0;

    data.forEach((day) => {
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
    <Card className="animate-fade-in" data-oid="j45aqn3">
      <CardHeader data-oid="zdpypem">
        <CardTitle className="flex items-center gap-2" data-oid="8y5quzh">
          Activity Dashboard
          <Badge variant="secondary" className="text-xs" data-oid="6qtj276">
            Your Progress
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent data-oid="2g-k:je">
        <Tabs defaultValue="weekly" className="w-full" data-oid="1asd84c">
          <TabsList className="grid w-full grid-cols-2" data-oid="lkp3si.">
            <TabsTrigger value="weekly" data-oid="lfcd77i">
              12 Weeks
            </TabsTrigger>
            <TabsTrigger value="monthly" data-oid=":lh5oh6">
              12 Months
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-6" data-oid="bkjyjqt">
            <ContributionChart
              data={weeklyData}
              timeframe="weekly"
              data-oid="e4aeth3"
            />
          </TabsContent>

          <TabsContent value="monthly" className="mt-6" data-oid="26733gx">
            <ContributionChart
              data={monthlyData}
              timeframe="monthly"
              data-oid="6h92t80"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContributionGraph;

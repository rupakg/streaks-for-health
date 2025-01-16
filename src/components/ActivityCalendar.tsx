import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Activity {
  id: string;
  name: string;
  color: string;
  lastCompleted?: string;
}

interface ActivityCalendarProps {
  activities: Activity[];
}

export const ActivityCalendar = ({ activities }: ActivityCalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const completedActivities = activities.reduce((acc, activity) => {
    if (activity.lastCompleted) {
      if (!acc[activity.lastCompleted]) {
        acc[activity.lastCompleted] = [];
      }
      acc[activity.lastCompleted].push({
        name: activity.name,
        color: activity.color,
      });
    }
    return acc;
  }, {} as Record<string, { name: string; color: string; }[]>);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + (direction === 'next' ? 1 : -1));
    setDate(newDate);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Activity Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {format(date, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        month={date}
        className="rounded-md border"
        components={{
          DayContent: ({ date }) => {
            const dateString = date.toISOString().split('T')[0];
            const dayActivities = completedActivities[dateString] || [];

            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <div>{date.getDate()}</div>
                {dayActivities.length > 0 && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {dayActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: activity.color }}
                        title={activity.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          },
        }}
      />
    </Card>
  );
};
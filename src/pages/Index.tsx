import { useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { ActivityCalendar } from "@/components/ActivityCalendar";
import { NewActivityDialog } from "@/components/NewActivityDialog";
import { useToast } from "@/components/ui/use-toast";

interface Activity {
  id: string;
  name: string;
  schedule: string;
  day?: string;
  streak: number;
  lastCompleted?: string;
  color: string;
}

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const handleSaveActivity = (activityData: { 
    id?: string;
    name: string; 
    schedule: string; 
    day?: string;
    color: string;
  }) => {
    if (activityData.id) {
      // Edit existing activity
      setActivities(prevActivities => prevActivities.map(activity => 
        activity.id === activityData.id 
          ? {
              ...activity,
              name: activityData.name,
              schedule: activityData.schedule,
              day: activityData.day,
              color: activityData.color,
            }
          : activity
      ));
      toast({
        title: "Activity updated",
        description: `${activityData.name} has been updated.`,
      });
    } else {
      // Create new activity
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        name: activityData.name,
        schedule: activityData.schedule,
        day: activityData.day,
        streak: 0,
        color: activityData.color,
      };
      setActivities([...activities, newActivity]);
      toast({
        title: "Activity created",
        description: `${activityData.name} has been added to your activities.`,
      });
    }
  };

  const handleComplete = (id: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = activity.lastCompleted === today;
        
        return {
          ...activity,
          lastCompleted: isCompletedToday ? undefined : today,
          streak: isCompletedToday ? activity.streak - 1 : activity.streak + 1,
        };
      }
      return activity;
    }));
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter(activity => activity.id !== id));
    toast({
      title: "Activity deleted",
      description: "The activity has been removed from your list.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health Habits</h1>
            <p className="text-muted-foreground mt-1">Track your daily health activities</p>
          </div>
          <NewActivityDialog onSave={handleSaveActivity} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  No activities yet. Create one to get started!
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onComplete={handleComplete}
                  onEdit={handleSaveActivity}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
          
          <ActivityCalendar activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Index;
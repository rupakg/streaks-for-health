import { useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { NewActivityDialog } from "@/components/NewActivityDialog";
import { useToast } from "@/components/ui/use-toast";

interface Activity {
  id: string;
  name: string;
  schedule: string;
  streak: number;
  lastCompleted?: string;
}

const Index = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const handleNewActivity = (activityData: { name: string; schedule: string }) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name: activityData.name,
      schedule: activityData.schedule,
      streak: 0,
    };
    setActivities([...activities, newActivity]);
    toast({
      title: "Activity created",
      description: `${activityData.name} has been added to your activities.`,
    });
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

  const handleEdit = (id: string) => {
    // To be implemented in future iterations
    toast({
      title: "Coming soon",
      description: "Edit functionality will be available in the next update.",
    });
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health Habits</h1>
            <p className="text-muted-foreground mt-1">Track your daily health activities</p>
          </div>
          <NewActivityDialog onSave={handleNewActivity} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {activities.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-muted/50 rounded-lg">
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
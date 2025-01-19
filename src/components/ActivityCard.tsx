import { Calendar, CheckCircle2, Edit2, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NewActivityDialog } from "@/components/NewActivityDialog";

interface ActivityCardProps {
  activity: {
    id: string;
    name: string;
    schedule: string;
    day?: string;
    streak: number;
    lastCompleted?: string;
    color: string;
  };
  onComplete: (id: string) => void;
  onEdit: (activityData: { 
    id?: string;
    name: string;
    schedule: string;
    day?: string;
    color: string;
  }) => void;
  onDelete: (id: string) => void;
}

export const ActivityCard = ({ activity, onComplete, onEdit, onDelete }: ActivityCardProps) => {
  const isCompletedToday = activity.lastCompleted === new Date().toISOString().split('T')[0];

  const scheduleText = activity.day 
    ? `${activity.schedule} on ${activity.day}`
    : activity.schedule;

  return (
    <Card className="p-6 animate-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Circle className="h-6 w-6" fill={activity.color} stroke="none" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{activity.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{scheduleText}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <NewActivityDialog 
            mode="edit"
            activity={activity}
            onSave={onEdit}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(activity.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">Streak:</div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            {activity.streak}
          </div>
        </div>
        <Button
          variant={isCompletedToday ? "secondary" : "default"}
          size="sm"
          className={cn(
            "transition-all",
            isCompletedToday && "text-primary"
          )}
          onClick={() => onComplete(activity.id)}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isCompletedToday ? "Completed" : "Complete"}
        </Button>
      </div>
    </Card>
  );
};
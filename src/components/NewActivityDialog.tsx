import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NewActivityDialogProps {
  onSave: (activity: { name: string; schedule: string; day?: string }) => void;
}

export const NewActivityDialog = ({ onSave }: NewActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const handleSave = () => {
    if (name && schedule) {
      const needsDay = ["weekly", "weekdays", "weekends"].includes(schedule);
      if (needsDay && !selectedDay) return;

      onSave({ 
        name, 
        schedule,
        day: needsDay ? selectedDay : undefined
      });
      setName("");
      setSchedule("");
      setSelectedDay("");
      setOpen(false);
    }
  };

  const showDayPicker = ["weekly", "weekdays", "weekends"].includes(schedule);
  const days = schedule === "weekends" 
    ? ["Saturday", "Sunday"]
    : schedule === "weekdays"
    ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Activity Name
            </label>
            <Input
              id="name"
              placeholder="e.g., Morning Run"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule</label>
            <Select value={schedule} onValueChange={(value) => {
              setSchedule(value);
              setSelectedDay("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showDayPicker && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Day</label>
              <RadioGroup value={selectedDay} onValueChange={setSelectedDay} className="grid grid-cols-1 gap-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <RadioGroupItem value={day} id={day} />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={showDayPicker && !selectedDay}
          >
            Create Activity
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
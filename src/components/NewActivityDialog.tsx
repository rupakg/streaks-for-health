import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit2 } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  schedule: string;
  day?: string;
  color: string;
}

interface NewActivityDialogProps {
  onSave: (activity: { 
    id?: string;
    name: string; 
    schedule: string; 
    day?: string;
    color: string;
  }) => void;
  activity?: Activity;
  mode?: 'create' | 'edit';
}

const COLORS = [
  "#8B5CF6", // Vivid Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
  "#10B981", // Emerald
  "#EF4444", // Red
  "#F59E0B", // Amber
];

export const NewActivityDialog = ({ onSave, activity, mode = 'create' }: NewActivityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useEffect(() => {
    if (activity && mode === 'edit') {
      setName(activity.name);
      setSchedule(activity.schedule);
      setSelectedColor(activity.color);
      
      if (activity.day) {
        if (activity.schedule === 'weekly') {
          setSelectedDay(activity.day);
        } else {
          setSelectedDays(activity.day.split(', '));
        }
      }
    }
  }, [activity, mode]);

  const handleSave = () => {
    if (name && schedule) {
      const needsDay = ["weekly"].includes(schedule);
      const needsDays = ["weekdays", "weekends"].includes(schedule);
      
      if (needsDay && !selectedDay) return;
      if (needsDays && selectedDays.length === 0) return;

      onSave({ 
        id: activity?.id,
        name, 
        schedule,
        day: needsDays ? selectedDays.join(", ") : (needsDay ? selectedDay : undefined),
        color: selectedColor
      });
      
      setName("");
      setSchedule("");
      setSelectedDay("");
      setSelectedDays([]);
      setOpen(false);
    }
  };

  const resetForm = () => {
    if (mode === 'edit' && activity) {
      setName(activity.name);
      setSchedule(activity.schedule);
      setSelectedColor(activity.color);
      if (activity.day) {
        if (activity.schedule === 'weekly') {
          setSelectedDay(activity.day);
        } else {
          setSelectedDays(activity.day.split(', '));
        }
      }
    } else {
      setName("");
      setSchedule("");
      setSelectedDay("");
      setSelectedDays([]);
      setSelectedColor(COLORS[0]);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      resetForm();
    }
  };

  const showDayPicker = ["weekly"].includes(schedule);
  const showDaysPicker = ["weekdays", "weekends"].includes(schedule);
  
  const days = schedule === "weekends" 
    ? ["Saturday", "Sunday"]
    : schedule === "weekdays"
    ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Activity
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Activity' : 'Edit Activity'}</DialogTitle>
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
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule</label>
            <Select value={schedule} onValueChange={(value) => {
              setSchedule(value);
              setSelectedDay("");
              setSelectedDays([]);
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

          {showDaysPicker && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Days</label>
              <div className="grid grid-cols-1 gap-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${day}`}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={`checkbox-${day}`}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={(showDayPicker && !selectedDay) || (showDaysPicker && selectedDays.length === 0)}
          >
            {mode === 'create' ? 'Create Activity' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
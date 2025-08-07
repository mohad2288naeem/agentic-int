import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  className?: string;
}

export const Calendar = ({ className }: CalendarProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  // Generate calendar days for April 2024 (as shown in reference)
  const daysInMonth = 30;
  const firstDayOfMonth = 1; // Monday (1 = Monday, 0 = Sunday)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Days with scheduled calls (matching reference image)
  const scheduledDays = [10, 14, 15, 16, 17, 18];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {currentMonth} {currentYear}
          </h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {days.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square flex items-center justify-center relative">
              {day && (
                <div className={`
                  w-8 h-8 flex items-center justify-center text-sm rounded-full
                  ${day === 10 ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground'}
                  ${scheduledDays.includes(day) && day !== 10 ? 'bg-primary-light text-primary' : ''}
                  hover:bg-accent cursor-pointer transition-colors
                `}>
                  {day}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
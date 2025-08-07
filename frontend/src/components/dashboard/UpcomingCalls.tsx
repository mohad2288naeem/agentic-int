import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useExpert } from "@/contexts/ExpertContext";
import { format } from "date-fns";

interface UpcomingCallsProps {
  className?: string;
}

export const UpcomingCalls = ({ className }: UpcomingCallsProps) => {
  const { scheduledCalls } = useExpert();
  
  // Get upcoming calls (scheduled status only)
  const upcomingCalls = scheduledCalls
    .filter(call => call.status === "scheduled")
    .slice(0, 5); // Show only next 5 calls

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Upcoming Calls
        </h3>
        
        <div className="space-y-3">
          {upcomingCalls.length > 0 ? (
            upcomingCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(call.interview_date), 'EEEE, MMM d')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {call.position}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {call.interview_time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No upcoming calls scheduled</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
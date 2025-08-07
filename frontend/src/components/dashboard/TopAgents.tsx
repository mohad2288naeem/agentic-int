import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  score: number;
}

interface TopAgentsProps {
  className?: string;
}

export const TopAgents = ({ className }: TopAgentsProps) => {
  const agents: Agent[] = [
    { id: '1', name: 'Emily', score: 76 },
    { id: '2', name: 'Alex', score: 58 },
    { id: '3', name: 'Jordan', score: 43 }
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Top Performing Agents
        </h3>
        
        <div className="space-y-3">
          {agents.map((agent, index) => (
            <div key={agent.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Star className={`h-4 w-4 ${index === 0 ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                  <span className="font-medium text-foreground">
                    {agent.name}
                  </span>
                </div>
              </div>
              <Badge variant={index === 0 ? "default" : "secondary"} className="font-semibold">
                {agent.score}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
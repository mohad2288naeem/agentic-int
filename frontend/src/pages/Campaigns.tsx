import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal,
  Users,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "completed" | "draft";
  progress: number;
  experts: number;
  interviews: {
    completed: number;
    total: number;
  };
  contentGenerated: number;
  startDate: string;
  endDate: string;
  topics: string[];
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "AI in Healthcare 2024",
    description: "Comprehensive interviews with healthcare AI experts to generate content about emerging trends",
    status: "active",
    progress: 67,
    experts: 12,
    interviews: { completed: 8, total: 12 },
    contentGenerated: 15,
    startDate: "2024-04-01",
    endDate: "2024-04-30",
    topics: ["AI Diagnostics", "Telemedicine", "Healthcare Analytics"]
  },
  {
    id: "2", 
    name: "Fintech Innovation Series",
    description: "Interview series with fintech leaders about blockchain and digital banking",
    status: "active",
    progress: 34,
    experts: 8,
    interviews: { completed: 3, total: 8 },
    contentGenerated: 7,
    startDate: "2024-04-10",
    endDate: "2024-05-10",
    topics: ["DeFi", "Digital Banking", "Cryptocurrency"]
  },
  {
    id: "3",
    name: "Sustainable Tech Trends", 
    description: "Expert insights on green technology and sustainable business practices",
    status: "paused",
    progress: 89,
    experts: 6,
    interviews: { completed: 5, total: 6 },
    contentGenerated: 12,
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    topics: ["Clean Energy", "Carbon Tech", "Sustainable Manufacturing"]
  }
];

const Campaigns = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "paused": return "bg-warning text-warning-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "draft": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-3 w-3" />;
      case "paused": return <Pause className="h-3 w-3" />;
      case "completed": return <Target className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campaign Management</h1>
            <p className="text-muted-foreground">Organize and track your interview campaigns</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === "active").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.interviews.completed, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent rounded-lg">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Content Generated</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.contentGenerated, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Users className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Experts</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.experts, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {campaign.name}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)} variant="secondary">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(campaign.status)}
                          <span>{campaign.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                      {campaign.description}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {campaign.progress}% complete
                    </span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Experts</span>
                    </div>
                    <p className="text-lg font-semibold">{campaign.experts}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Interviews</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {campaign.interviews.completed}/{campaign.interviews.total}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Content</span>
                    </div>
                    <p className="text-lg font-semibold">{campaign.contentGenerated}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Start</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(campaign.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">End</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <p className="text-sm font-medium mb-2">Focus Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm">View Details</Button>
                  <Button size="sm" variant="outline">Schedule Interviews</Button>
                  <Button size="sm" variant="outline">Export Data</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
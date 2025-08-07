import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Radio,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LiveCall {
  id: string;
  expert: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  aiAgent: string;
  status: "active" | "connecting" | "on_hold" | "ending";
  duration: string;
  progress: number;
  quality: {
    audio: "excellent" | "good" | "poor";
    connection: "stable" | "unstable";
    engagement: number;
  };
  transcript: {
    current: string;
    wordCount: number;
  };
  campaign: string;
  startTime: string;
}

const mockLiveCalls: LiveCall[] = [
  {
    id: "1",
    expert: {
      name: "Dr. Sarah Chen",
      specialty: "AI & Machine Learning"
    },
    aiAgent: "Emily",
    status: "active",
    duration: "23:45",
    progress: 65,
    quality: {
      audio: "excellent",
      connection: "stable",
      engagement: 89
    },
    transcript: {
      current: "So the key challenge in implementing AI diagnostics is ensuring that the model can handle edge cases effectively. When we deployed our system at Stanford Medical...",
      wordCount: 2341
    },
    campaign: "AI in Healthcare 2024",
    startTime: "2024-04-15T14:30:00Z"
  },
  {
    id: "2",
    expert: {
      name: "Marcus Rodriguez",
      specialty: "Fintech & Blockchain"
    },
    aiAgent: "Alex",
    status: "connecting",
    duration: "00:45",
    progress: 5,
    quality: {
      audio: "good",
      connection: "unstable", 
      engagement: 0
    },
    transcript: {
      current: "Hello Marcus, thank you for joining us today. I'm excited to discuss the future of decentralized finance...",
      wordCount: 45
    },
    campaign: "Fintech Innovation Series",
    startTime: "2024-04-15T15:15:00Z"
  }
];

const LiveMonitoring = () => {
  const [liveCalls, setLiveCalls] = useState<LiveCall[]>(mockLiveCalls);
  const [selectedCall, setSelectedCall] = useState<LiveCall | null>(liveCalls[0] || null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCalls(prev => prev.map(call => {
        if (call.status === "active") {
          const [minutes, seconds] = call.duration.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds + 1;
          const newMinutes = Math.floor(totalSeconds / 60);
          const newSeconds = totalSeconds % 60;
          
          return {
            ...call,
            duration: `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`,
            progress: Math.min(call.progress + 0.5, 100),
            transcript: {
              ...call.transcript,
              wordCount: call.transcript.wordCount + Math.floor(Math.random() * 5)
            }
          };
        }
        return call;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "connecting": return "bg-warning text-warning-foreground";
      case "on_hold": return "bg-muted text-muted-foreground";
      case "ending": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent": return "text-success";
      case "good": return "text-warning";
      case "poor": return "text-destructive";
      case "stable": return "text-success";
      case "unstable": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getQualityIcon = (type: string, quality: string) => {
    if (type === "audio") {
      return quality === "poor" ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />;
    }
    if (type === "connection") {
      return quality === "stable" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Live Interview Monitoring</h1>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              {liveCalls.filter(c => c.status === "active").length} Live
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <Radio className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Calls</p>
                <p className="text-2xl font-bold">
                  {liveCalls.filter(c => c.status === "active").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Phone className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connecting</p>
                <p className="text-2xl font-bold">
                  {liveCalls.filter(c => c.status === "connecting").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">32m</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent rounded-lg">
                <CheckCircle className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Calls List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Active Interviews</h2>
            
            {liveCalls.map((call) => (
              <Card 
                key={call.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCall?.id === call.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCall(call)}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {call.expert.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{call.expert.name}</p>
                        <p className="text-xs text-muted-foreground">{call.expert.specialty}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(call.status)} variant="secondary">
                      {call.status}
                    </Badge>
                  </div>

                  {/* Duration & Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {call.duration}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {call.progress}%
                      </span>
                    </div>
                    <Progress value={call.progress} className="h-1" />
                  </div>

                  {/* Quality Indicators */}
                  <div className="flex items-center justify-between text-xs">
                    <div className={`flex items-center space-x-1 ${getQualityColor(call.quality.audio)}`}>
                      {getQualityIcon("audio", call.quality.audio)}
                      <span>{call.quality.audio}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getQualityColor(call.quality.connection)}`}>
                      {getQualityIcon("connection", call.quality.connection)}
                      <span>{call.quality.connection}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {call.quality.engagement}% engaged
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-2">
            {selectedCall ? (
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {selectedCall.expert.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedCall.expert.name}</h3>
                        <p className="text-muted-foreground">{selectedCall.expert.specialty}</p>
                        <p className="text-sm text-muted-foreground">
                          Interviewing with AI Agent: {selectedCall.aiAgent}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedCall.status)} variant="secondary">
                        {selectedCall.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mic className="h-4 w-4 mr-2" />
                            Join Call
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <PhoneOff className="h-4 w-4 mr-2" />
                            End Interview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Call Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCall.duration}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCall.transcript.wordCount}</p>
                      <p className="text-sm text-muted-foreground">Words</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCall.quality.engagement}%</p>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{selectedCall.progress}%</p>
                      <p className="text-sm text-muted-foreground">Progress</p>
                    </div>
                  </div>

                  {/* Quality Indicators */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-3">
                      <div className="flex items-center space-x-2">
                        <Volume2 className={`h-4 w-4 ${getQualityColor(selectedCall.quality.audio)}`} />
                        <div>
                          <p className="text-sm font-medium">Audio Quality</p>
                          <p className={`text-sm ${getQualityColor(selectedCall.quality.audio)}`}>
                            {selectedCall.quality.audio}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`h-4 w-4 ${getQualityColor(selectedCall.quality.connection)}`} />
                        <div>
                          <p className="text-sm font-medium">Connection</p>
                          <p className={`text-sm ${getQualityColor(selectedCall.quality.connection)}`}>
                            {selectedCall.quality.connection}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Engagement</p>
                          <p className="text-sm text-primary">{selectedCall.quality.engagement}%</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Live Transcript */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Live Transcript</h4>
                    <Card className="p-4 bg-muted/30">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Radio className="h-3 w-3 animate-pulse text-success" />
                          <span>Live transcription</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {selectedCall.transcript.current}
                          <span className="animate-pulse">|</span>
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Control Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Interview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mic className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Monitor Audio
                    </Button>
                    <Button size="sm" variant="destructive">
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Interview
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Interviews</h3>
                <p className="text-muted-foreground">
                  Select an active interview to monitor in real-time
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
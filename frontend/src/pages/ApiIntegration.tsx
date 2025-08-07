import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Webhook,
  Send,
  FileText,
  BarChart3,
  Globe
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  status: "active" | "inactive" | "error";
  lastUsed: string;
  totalCalls: number;
  successRate: number;
}

interface ContentPlatform {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  endpoint: string;
  contentGenerated: number;
  lastSync: string;
}

const mockEndpoints: APIEndpoint[] = [
  {
    id: "1",
    name: "WordPress Blog Platform",
    url: "https://myblog.com/api/posts",
    method: "POST",
    status: "active",
    lastUsed: "2024-04-15T10:30:00Z",
    totalCalls: 45,
    successRate: 98
  },
  {
    id: "2",
    name: "LinkedIn Content API",
    url: "https://api.linkedin.com/v2/posts",
    method: "POST", 
    status: "active",
    lastUsed: "2024-04-15T09:15:00Z",
    totalCalls: 23,
    successRate: 95
  },
  {
    id: "3",
    name: "Medium Publication",
    url: "https://api.medium.com/v1/publications/stories",
    method: "POST",
    status: "error",
    lastUsed: "2024-04-14T16:20:00Z",
    totalCalls: 12,
    successRate: 67
  }
];

const mockPlatforms: ContentPlatform[] = [
  {
    id: "1",
    name: "WordPress",
    type: "Blog Platform",
    connected: true,
    endpoint: "https://myblog.com/api/posts",
    contentGenerated: 15,
    lastSync: "2024-04-15T10:30:00Z"
  },
  {
    id: "2",
    name: "LinkedIn",
    type: "Social Media",
    connected: true,
    endpoint: "https://api.linkedin.com/v2/posts",
    contentGenerated: 8,
    lastSync: "2024-04-15T09:15:00Z"
  },
  {
    id: "3",
    name: "Medium",
    type: "Publishing Platform",
    connected: false,
    endpoint: "",
    contentGenerated: 0,
    lastSync: ""
  }
];

const ApiIntegration = () => {
  const [endpoints] = useState<APIEndpoint[]>(mockEndpoints);
  const [platforms] = useState<ContentPlatform[]>(mockPlatforms);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "inactive": return "bg-muted text-muted-foreground";
      case "error": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "inactive": return <AlertCircle className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleTestEndpoint = async (endpointId: string) => {
    setTestingEndpoint(endpointId);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingEndpoint(null);
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Integration</h1>
              <p className="text-muted-foreground">Connect transcripts to third-party content generation platforms</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <Webhook className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Endpoints</p>
                <p className="text-2xl font-bold">
                  {endpoints.filter(e => e.status === "active").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <Send className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total API Calls</p>
                <p className="text-2xl font-bold">
                  {endpoints.reduce((acc, e) => acc + e.totalCalls, 0)}
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
                  {platforms.reduce((acc, p) => acc + p.contentGenerated, 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <BarChart3 className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(endpoints.reduce((acc, e) => acc + e.successRate, 0) / endpoints.length)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="platforms">Content Platforms</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* API Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Endpoints</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>

              {endpoints.map((endpoint) => (
                <Card key={endpoint.id} className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary-light rounded-lg">
                          <Webhook className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{endpoint.name}</h3>
                          <p className="text-sm text-muted-foreground">{endpoint.url}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(endpoint.status)} variant="secondary">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(endpoint.status)}
                            <span>{endpoint.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">{endpoint.method}</Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{endpoint.totalCalls}</p>
                        <p className="text-sm text-muted-foreground">Total Calls</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{endpoint.successRate}%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">
                          {new Date(endpoint.lastUsed).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Last Used</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">
                          {new Date(endpoint.lastUsed).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Time</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        onClick={() => handleTestEndpoint(endpoint.id)}
                        disabled={testingEndpoint === endpoint.id}
                      >
                        {testingEndpoint === endpoint.id ? (
                          "Testing..."
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Test Connection
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Content Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Content Platforms</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Platform
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <Card key={platform.id} className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-light rounded-lg">
                            <Globe className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{platform.name}</h3>
                            <p className="text-sm text-muted-foreground">{platform.type}</p>
                          </div>
                        </div>
                        <Switch checked={platform.connected} />
                      </div>

                      {/* Stats */}
                      {platform.connected && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Content Generated</span>
                            <span className="text-sm font-medium">{platform.contentGenerated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Last Sync</span>
                            <span className="text-sm font-medium">
                              {new Date(platform.lastSync).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Connection Info */}
                      {platform.connected ? (
                        <div className="p-2 bg-success/10 rounded-lg">
                          <p className="text-sm text-success font-medium">✓ Connected</p>
                          <p className="text-xs text-muted-foreground">{platform.endpoint}</p>
                        </div>
                      ) : (
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          {platform.connected ? "Reconfigure" : "Connect"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">Global API Key</Label>
                    <Input
                      id="apiKey" 
                      type="password"
                      placeholder="Enter your API key..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      defaultValue="30"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="retries">Max Retries</Label>
                    <Input
                      id="retries"
                      type="number"
                      defaultValue="3"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Auto-send to platforms</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Include transcript metadata</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Quality approval required</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Send failure notifications</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiIntegration;
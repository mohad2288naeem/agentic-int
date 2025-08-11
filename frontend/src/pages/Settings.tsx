import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Key,
  Database,
  Download,
  Trash2,
  Save,
  Mail,
  Phone,
  Globe,
  Lock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const [user] = useState({
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    company: "AI Insights Corp",
  });

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and system configuration
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            {/* <TabsTrigger value="api">API Keys</TabsTrigger> */}
            {/* <TabsTrigger value="data">Data</TabsTrigger> */}
            {/* <TabsTrigger value="system">System</TabsTrigger>/ */}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue={user.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue={user.company} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={user.role.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">
                          Pacific Time (UTC-8)
                        </SelectItem>
                        <SelectItem value="utc-7">
                          Mountain Time (UTC-7)
                        </SelectItem>
                        <SelectItem value="utc-6">
                          Central Time (UTC-6)
                        </SelectItem>
                        <SelectItem value="utc-5">
                          Eastern Time (UTC-5)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Interview Started</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when interviews begin
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Interview Completed</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when interviews finish
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Transcription Ready</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when transcripts are processed
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Quality Issues</p>
                        <p className="text-sm text-muted-foreground">
                          Get alerted about audio or connection problems
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Real-time Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Browser notifications for live events
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Critical system notifications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Weekly Reports</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Performance Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly analytics and insights
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </h3>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">
                        sk-****************************
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created on April 1, 2024
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground">
                        sk-****************************
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created on March 15, 2024
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Management
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Export Data</h4>
                  <div className="space-y-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Transcripts
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Expert Database
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Campaign Data
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Data Retention</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="transcriptRetention">
                        Transcript Retention (days)
                      </Label>
                      <Input
                        id="transcriptRetention"
                        type="number"
                        defaultValue="365"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="audioRetention">
                        Audio Recording Retention (days)
                      </Label>
                      <Input
                        id="audioRetention"
                        type="number"
                        defaultValue="90"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-destructive">
                    Danger Zone
                  </h4>
                  <div className="space-y-3 p-4 border border-destructive/20 rounded-lg">
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all your data including
                      transcripts, experts, and campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                System Configuration
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Recording Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="audioQuality">Audio Quality</Label>
                      <Select defaultValue="high">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (16kHz)</SelectItem>
                          <SelectItem value="medium">Medium (32kHz)</SelectItem>
                          <SelectItem value="high">High (48kHz)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-backup recordings</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically backup to cloud storage
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Integration Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                      <Input
                        id="apiTimeout"
                        type="number"
                        defaultValue="30"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxRetries">Max API Retries</Label>
                      <Input
                        id="maxRetries"
                        type="number"
                        defaultValue="3"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable caching</p>
                        <p className="text-sm text-muted-foreground">
                          Cache frequently accessed data
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Real-time updates</p>
                        <p className="text-sm text-muted-foreground">
                          Enable live dashboard updates
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

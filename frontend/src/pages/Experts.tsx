import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useExpert, Expert } from "@/contexts/ExpertContext";
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Temporary placeholder for Add Expert functionality
const AddExpertDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => null;

const Experts = () => {
  const { experts, admin, getExpertScheduledCalls } = useExpert();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [callingExpertId, setCallingExpertId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCallNow = async (expert: Expert) => {
    if (!admin) {
      toast({
        title: "Error",
        description: "Admin context is not available.",
        variant: "destructive",
      });
      return;
    }

    setCallingExpertId(expert.id);

    try {
      // Create a dummy scheduled call to get an ID
      const scheduledCallResponse = await fetch("/api/scheduled-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate_name: expert.name,
          candidate_email: expert.email,
          candidate_phone: expert.phone,
          position: expert.specialty,
          interview_date: new Date().toISOString().split("T")[0], // ✅ Set current date
          interview_time: new Date().toLocaleTimeString("en-US", {
            hour12: false,
          }), // ✅ Set current time
          admin_id: admin.id,
          expert_id: expert.id,
          status: "scheduled", // ✅ Corrected status
        }),
      });

      if (!scheduledCallResponse.ok) {
        throw new Error("Failed to create a temporary scheduled call.");
      }

      const scheduledCall = await scheduledCallResponse.json();

      const response = await fetch("/api/vapi/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: expert.name,
          number: expert.phone,
          admin_id: admin.id,
          scheduled_call_id: scheduledCall.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Call Initiated",
          description: `Calling ${expert.name} now.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error?.message || "Failed to initiate call.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setCallingExpertId(null);
    }
  };

  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "all" || expert.specialty.includes(filterSpecialty);
    const matchesStatus =
      filterStatus === "all" || expert.status === filterStatus;

    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-warning text-warning-foreground";
      case "offline":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Expert Management
            </h1>
            <p className="text-muted-foreground">
              Manage your subject-matter experts and their availability
            </p>
          </div>
          {/* <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expert
          </Button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Experts</p>
                <p className="text-2xl font-bold">{experts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">
                  {experts.filter((e) => e.status === "available").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(
                    experts.reduce((acc, e) => acc + e.rating, 0) /
                    experts.length
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent rounded-lg">
                <Phone className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Interviews
                </p>
                <p className="text-2xl font-bold">
                  {experts.reduce((acc, e) => acc + e.interviews, 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experts by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="AI">AI & Machine Learning</SelectItem>
                <SelectItem value="Fintech">Fintech & Blockchain</SelectItem>
                <SelectItem value="Healthcare">
                  Healthcare Innovation
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.reverse().map((expert) => (
            <Card
              key={expert.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {expert.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {expert.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {expert.specialty}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={getStatusColor(expert.status)}
                    variant="secondary"
                  >
                    {expert.status}
                  </Badge>
                </div>

                {/* Rating & Interviews */}
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">{expert.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {expert.interviews} interviews
                  </div> */}
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {expert.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {expert.phone}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {expert.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last: {expert.last_interview}
                    </span>
                  </div>
                </div>

                {/* Scheduled Calls */}
                {getExpertScheduledCalls(expert.id).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">
                      Scheduled Calls (
                      {getExpertScheduledCalls(expert.id).length})
                    </h4>
                    <div className="space-y-1">
                      {getExpertScheduledCalls(expert.id)
                        .slice(0, 2)
                        .map((call) => (
                          <div
                            key={call.id}
                            className="text-xs p-2 bg-muted rounded"
                          >
                            <div className="font-medium">
                              {call.candidate_name}
                            </div>
                            <div className="text-muted-foreground">
                              {call.interview_date} at {call.interview_time}
                            </div>
                          </div>
                        ))}
                      {getExpertScheduledCalls(expert.id).length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{getExpertScheduledCalls(expert.id).length - 2} more
                          calls
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCallNow(expert)}
                    disabled={callingExpertId === expert.id}
                  >
                    {callingExpertId === expert.id ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Calling...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </>
                    )}
                  </Button>
                  {/* <Button size="sm" variant="outline">
                    View Profile
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Expert Dialog */}
        {/* <AddExpertDialog open={showAddDialog} onOpenChange={setShowAddDialog} /> */}
      </div>
    </div>
  );
};

export default Experts;

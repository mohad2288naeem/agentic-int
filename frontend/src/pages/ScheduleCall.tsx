import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useExpert } from "@/contexts/ExpertContext";
import { Calendar, Clock, Phone, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assistant {
  id: string;
  name: string;
}

interface PhoneNumber {
  id: string;
  number: string;
  createdAt: string;
  assistantId: string;
  name: string;
}

interface CallFormData {
  expertName: string;
  expertEmail: string;
  expertPhone: string;
  specialty: string;
  location: string;
  interviewDate: string;
  interviewTime: string;
  notes: string;
}

const ScheduleCallForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { admin, addScheduledCall } = useExpert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CallFormData>({
    expertName: "",
    expertEmail: "",
    expertPhone: "",
    specialty: "",
    location: "",
    interviewDate: "",
    interviewTime: "",
    notes: "",
  });

  const handleInputChange = (field: keyof CallFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.expertName ||
      !formData.expertEmail ||
      !formData.specialty ||
      !formData.interviewDate
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const expertResponse = await fetch("/api/experts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.expertName,
          email: formData.expertEmail,
          phone: formData.expertPhone,
          specialty: formData.specialty,
          location: formData.location,
          status: "available",
        }),
      });

      if (!expertResponse.ok) {
        const errorData = await expertResponse.json();
        throw new Error(errorData.error || "Failed to create expert");
      }

      const expertData = await expertResponse.json();

      await addScheduledCall({
        candidate_name: "Interview Call",
        candidate_email: formData.expertEmail,
        candidate_phone: formData.expertPhone,
        position: formData.specialty,
        interview_date: formData.interviewDate,
        interview_time: formData.interviewTime,
        expert_id: expertData.id,
        admin_id: admin?.id || "",
        notes: formData.notes,
        status: "scheduled",
      });

      toast({
        title: "Expert and Call Scheduled Successfully!",
        description: `Expert ${formData.expertName} has been added and call scheduled for ${formData.interviewDate} at ${formData.interviewTime}.`,
      });

      setFormData({
        expertName: "",
        expertEmail: "",
        expertPhone: "",
        specialty: "",
        location: "",
        interviewDate: "",
        interviewTime: "",
        notes: "",
      });

      navigate("/experts");
    } catch (error) {
      const errorMessage =
        error.message &&
        error.message.includes("duplicate key value violates unique constraint")
          ? "Expert Details already exists"
          : error.message ||
            "Failed to schedule the interview. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Expert Registration & Call Scheduling</span>
        </CardTitle>
        <CardDescription>
          Fill in your expert details and schedule a new interview call.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expertName">Expert Name *</Label>
              <Input
                id="expertName"
                type="text"
                placeholder="Enter expert's full name"
                value={formData.expertName}
                onChange={(e) =>
                  handleInputChange("expertName", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertEmail">Email Address *</Label>
              <Input
                id="expertEmail"
                type="email"
                placeholder="expert@example.com"
                value={formData.expertEmail}
                onChange={(e) =>
                  handleInputChange("expertEmail", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expertPhone">Phone Number</Label>
              <Input
                id="expertPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.expertPhone}
                onChange={(e) =>
                  handleInputChange("expertPhone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Input
                id="specialty"
                type="text"
                placeholder="e.g. Software Engineering, Data Science"
                value={formData.specialty}
                onChange={(e) => handleInputChange("specialty", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date *</Label>
              <Input
                id="interviewDate"
                type="date"
                value={formData.interviewDate}
                onChange={(e) =>
                  handleInputChange("interviewDate", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewTime">Interview Time</Label>
              <Input
                id="interviewTime"
                type="time"
                value={formData.interviewTime}
                onChange={(e) =>
                  handleInputChange("interviewTime", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes for the interview..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 animate-spin" />
                <span>Scheduling Interview...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Register Expert & Schedule Call</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const AssignAssistantModal = ({
  isOpen,
  onClose,
  phoneNumber,
  onAssistantAssigned,
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: PhoneNumber | null;
  onAssistantAssigned: () => void;
}) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchAssistants = async () => {
        try {
          const response = await fetch("/api/vapi/assistants");
          const result = await response.json();
          if (response.ok) {
            setAssistants(result.data);
            setSelectedAssistantId(phoneNumber?.assistantId || null);
          } else {
            console.error("Failed to fetch assistants");
          }
        } catch (error) {
          console.error("Error fetching assistants", error);
        }
      };
      fetchAssistants();
    }
  }, [isOpen, phoneNumber]);

  const handleSave = async () => {
    if (!phoneNumber || !selectedAssistantId) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/vapi/phone-numbers/${phoneNumber.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assistantId: selectedAssistantId }),
        }
      );

      if (response.ok) {
        toast({
          title: "Assistant Assigned",
          description: `Successfully assigned assistant to ${phoneNumber.number}.`,
        });
        onAssistantAssigned();
        onClose();
      } else {
        const result = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error?.message || "Failed to assign assistant.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Assistant to {phoneNumber?.number}</DialogTitle>
          <DialogDescription>
            Select an assistant to handle incoming calls for this number.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select
            value={selectedAssistantId || ""}
            onValueChange={setSelectedAssistantId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an assistant" />
            </SelectTrigger>
            <SelectContent>
              {assistants.map((assistant) => (
                <SelectItem key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function ScheduleCall() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoneNumber, setSelectedPhoneNumber] =
    useState<PhoneNumber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchPhoneNumbers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vapi/phone-numbers");
      const result = await response.json();
      if (response.ok) {
        setPhoneNumbers(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching phone numbers",
          description: result.error?.message || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const handleEditAssistant = (phoneNumber: PhoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Calls</h1>
        <p className="text-muted-foreground mt-2">
          Schedule a new call or view available phone numbers.
        </p>
      </div>
      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">Schedule a Call</TabsTrigger>
          <TabsTrigger value="numbers">Available Phone Numbers</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule" className="mt-6">
          <ScheduleCallForm />
        </TabsContent>
        <TabsContent value="numbers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Phone Numbers</CardTitle>
              <CardDescription>
                A list of all your configured phone numbers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading phone numbers...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Assistant ID</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phoneNumbers.map((number) => (
                      <TableRow key={number.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{number.number}</Badge>
                        </TableCell>
                        <TableCell>{number.name}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => handleEditAssistant(number)}
                          >
                            {number.assistantId}{" "}
                            <Edit className="h-3 w-3 ml-2" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {new Date(number.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AssignAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phoneNumber={selectedPhoneNumber}
        onAssistantAssigned={fetchPhoneNumbers}
      />
    </div>
  );
}

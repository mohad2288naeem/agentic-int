import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, User } from "lucide-react";

interface CallFormData {
  name: string;
  email: string;
  phone: string;
  aiAgent: string;
}

const aiAgents = [
  { id: "emily", name: "Emily", phone: "+1 (555) 0123" },
  { id: "alex", name: "Alex", phone: "+1 (555) 0124" },
  { id: "jordan", name: "Jordan", phone: "+1 (555) 0125" },
  { id: "sarah", name: "Sarah", phone: "+1 (555) 0126" },
];

export function CreateCallForm() {
  const [formData, setFormData] = useState<CallFormData>({
    name: "",
    email: "",
    phone: "",
    aiAgent: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CallFormData) => (
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.aiAgent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to schedule the call.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedAgent = aiAgents.find(agent => agent.id === formData.aiAgent);
      
      toast({
        title: "Call Scheduled Successfully!",
        description: `${selectedAgent?.name} will call ${formData.name} at ${formData.phone}`,
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        aiAgent: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule call. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Contact Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium flex items-center">
          <User className="h-3 w-3 mr-1" />
          Contact Name
        </Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleInputChange("name")(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email")(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium flex items-center">
          <Phone className="h-3 w-3 mr-1" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone")(e.target.value)}
          className="h-9"
        />
      </div>

      {/* AI Agent Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          AI Agent
        </Label>
        <Select value={formData.aiAgent} onValueChange={handleInputChange("aiAgent")}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Choose AI agent" />
          </SelectTrigger>
          <SelectContent>
            {aiAgents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{agent.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {agent.phone}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-9"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Scheduling..." : "Schedule Call"}
      </Button>
    </form>
  );
}
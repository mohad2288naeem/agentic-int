import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
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

interface Assistant {
  id: string;
  name: string;
  model: {
    model: string;
    provider: string;
  };
  voice: {
    voiceId: string;
    provider: string;
  };
  createdAt: string;
}

interface AssistantPayload {
  name: string;
  model: {
    provider: string;
    model: string;
    messages: {
      role: string;
      content: string;
    }[];
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  firstMessage: string;
}

const CreateAssistantForm = ({
  onAssistantCreated,
}: {
  onAssistantCreated: () => void;
}) => {
  const [assistantName, setAssistantName] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [voice, setVoice] = useState("brian");
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setAssistantName("");
    setSystemPrompt("");
    setModel("gpt-3.5-turbo");
    setVoice("brian");
    setFirstMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const assistantData: AssistantPayload = {
      name: assistantName,
      model: {
        provider: "openai",
        model: model,
        messages: [],
      },
      voice: {
        provider: "azure",
        voiceId: "brian",
      },
      firstMessage: firstMessage,
    };

    if (systemPrompt) {
      assistantData.model.messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    try {
      const response = await fetch("/api/vapi/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assistantData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Assistant Created Successfully!",
          description: `Your new assistant "${assistantData.name}" is ready.`,
        });
        resetForm();
        onAssistantCreated();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error?.message || "Failed to create assistant",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Core Configuration</CardTitle>
          <CardDescription>
            Define the basic identity and personality of your assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assistantName">Assistant Name</Label>
            <Input
              id="assistantName"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              placeholder="e.g., Sales Assistant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Define the assistant's role and personality. e.g., You are a friendly and helpful assistant."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice and Language Model</CardTitle>
          <CardDescription>
            Choose the voice your assistant will use and the model that powers
            its intelligence.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectItem value="brian">Brian (11 Labs)</SelectItem>
                <SelectItem value="emma">Emma (11 Labs)</SelectItem>
                <SelectItem value="andrew">Andrew (11 Labs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Language Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initial Message</CardTitle>
          <CardDescription>
            This is the first thing your assistant will say when a call starts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="firstMessage">First Message</Label>
            <Textarea
              id="firstMessage"
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              placeholder="e.g., Hello, how can I help you today?"
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Creating..." : "Create Assistant"}
        </Button>
      </div>
    </form>
  );
};

export const Assistants = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssistants = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/vapi/assistants");
      const result = await response.json();
      if (response.ok) {
        setAssistants(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching assistants",
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
    fetchAssistants();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Assistants</h1>
        <p className="text-muted-foreground mt-2">
          Create a new voice assistant or manage your existing ones.
        </p>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="all">All Assistants</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-6">
          <CreateAssistantForm onAssistantCreated={fetchAssistants} />
        </TabsContent>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Existing Assistants</CardTitle>
              <CardDescription>
                A list of all your configured assistants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading assistants...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assistants.map((assistant) => (
                      <TableRow key={assistant.id}>
                        <TableCell>
                          <div className="font-medium">{assistant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {assistant.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {assistant.model.provider}
                          </Badge>{" "}
                          {assistant.model.model}
                        </TableCell>
                        <TableCell>
                          {new Date(assistant.createdAt).toLocaleDateString()}
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
    </div>
  );
};

export default Assistants;

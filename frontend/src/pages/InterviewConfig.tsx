import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Save,
  Plus,
  Trash2,
  Edit,
  Bot,
  MessageSquare,
  Volume2,
  Brain,
  Clock,
  Target
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface QuestionBank {
  id: string;
  name: string;
  category: string;
  questions: string[];
  usage: number;
}

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  tone: string;
  followUpStyle: string;
  active: boolean;
}

const mockQuestionBanks: QuestionBank[] = [
  {
    id: "1",
    name: "AI & Technology Deep Dive",
    category: "Technology",
    questions: [
      "What are the most significant breakthroughs in AI that you've witnessed recently?",
      "How do you see AI transforming your industry in the next 5 years?",
      "What are the biggest challenges in implementing AI solutions?",
      "How do you balance innovation with ethical considerations?"
    ],
    usage: 24
  },
  {
    id: "2",
    name: "Healthcare Innovation",
    category: "Healthcare", 
    questions: [
      "What role does technology play in improving patient outcomes?",
      "How has telemedicine changed your practice?",
      "What are the biggest challenges in healthcare technology adoption?",
      "How do you ensure patient data privacy and security?"
    ],
    usage: 18
  }
];

const mockAIPersonalities: AIPersonality[] = [
  {
    id: "1",
    name: "Emily - Professional Interviewer",
    description: "Experienced, thorough, and engaging interviewer with a journalism background",
    tone: "Professional but warm",
    followUpStyle: "Deep, probing questions",
    active: true
  },
  {
    id: "2", 
    name: "Alex - Casual Conversationalist",
    description: "Friendly, informal approach that puts experts at ease",
    tone: "Casual and conversational",
    followUpStyle: "Natural flow with clarifying questions",
    active: true
  }
];

const InterviewConfig = () => {
  const [questionBanks] = useState<QuestionBank[]>(mockQuestionBanks);
  const [aiPersonalities] = useState<AIPersonality[]>(mockAIPersonalities);
  const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);
  const [newQuestion, setNewQuestion] = useState("");

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Interview Configuration</h1>
              <p className="text-muted-foreground">Configure question banks, AI personalities, and interview flows</p>
            </div>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Question Banks</TabsTrigger>
            <TabsTrigger value="personalities">AI Personalities</TabsTrigger>
            <TabsTrigger value="flows">Interview Flows</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Question Banks Tab */}
          <TabsContent value="questions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Question Banks List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Question Banks</h2>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Bank
                  </Button>
                </div>

                {questionBanks.map((bank) => (
                  <Card 
                    key={bank.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedBank?.id === bank.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedBank(bank)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{bank.name}</h3>
                        <Badge variant="secondary">{bank.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bank.questions.length} questions
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Used in {bank.usage} interviews
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Question Bank Details */}
              <div className="lg:col-span-2">
                {selectedBank ? (
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{selectedBank.name}</h3>
                          <p className="text-muted-foreground">{selectedBank.category} Category</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Bank
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Questions ({selectedBank.questions.length})</h4>
                        {selectedBank.questions.map((question, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-start justify-between">
                              <p className="text-sm flex-1">{question}</p>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Add New Question</h4>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter a new question..."
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="flex-1"
                          />
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Question Bank</h3>
                    <p className="text-muted-foreground">
                      Choose a question bank to view and edit questions
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* AI Personalities Tab */}
          <TabsContent value="personalities" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">AI Interviewer Personalities</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Personality
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiPersonalities.map((personality) => (
                  <Card key={personality.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-light rounded-lg">
                            <Bot className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{personality.name}</h3>
                            <p className="text-sm text-muted-foreground">{personality.description}</p>
                          </div>
                        </div>
                        <Badge variant={personality.active ? "default" : "secondary"}>
                          {personality.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium flex items-center">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Tone
                          </p>
                          <p className="text-sm text-muted-foreground">{personality.tone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium flex items-center">
                            <Brain className="h-3 w-3 mr-1" />
                            Follow-up Style
                          </p>
                          <p className="text-sm text-muted-foreground">{personality.followUpStyle}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          Test
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Interview Flows Tab */}
          <TabsContent value="flows" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Interview Flow Configuration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Opening Sequence</h3>
                    <Textarea 
                      placeholder="Configure how interviews should begin..."
                      className="min-h-[100px]"
                      defaultValue="Hello [Expert Name], thank you for joining us today. I'm excited to learn about your expertise in [Specialty]. Let's start with..."
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Closing Sequence</h3>
                    <Textarea 
                      placeholder="Configure how interviews should end..."
                      className="min-h-[100px]"
                      defaultValue="Thank you so much for sharing your insights today. Is there anything else you'd like to add about [Topic]? We really appreciate your time and expertise."
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Follow-up Triggers</h3>
                    <div className="space-y-2">
                      <Label>When should AI ask follow-up questions?</Label>
                      <Select defaultValue="interesting">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">After every response</SelectItem>
                          <SelectItem value="interesting">When response is interesting</SelectItem>
                          <SelectItem value="short">When response is too short</SelectItem>
                          <SelectItem value="manual">Manual triggers only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Interview Duration</h3>
                    <div className="space-y-2">
                      <Label>Target interview length</Label>
                      <Select defaultValue="45">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="custom">Custom duration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recording Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Auto-record interviews</Label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Real-time transcription</Label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Quality monitoring</Label>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Interview start notifications</Label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Quality alerts</Label>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Completion notifications</Label>
                    <input type="checkbox" defaultChecked />
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

export default InterviewConfig;
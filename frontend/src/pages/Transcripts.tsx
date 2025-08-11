import { useState, useEffect } from "react";
import { useExpert } from "@/contexts/ExpertContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  Play,
  FileText,
  Clock,
  User,
  Star,
  Eye,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Transcript {
  id: string;
  transcript: string;
  summary: string | null;
  created_at: string;
  status: string;
  ended_reason: string | null;
  recording_url: string | null;
  raw_data: {
    customer?: {
      name?: string;
      number?: string;
    };
    costs?: {
      cost: number;
      type: string;
    }[];
  };
}

const ConversationModal = ({
  isOpen,
  onClose,
  transcript,
  toast,
}: {
  isOpen: boolean;
  onClose: () => void;
  transcript: Transcript | null;
  toast: (options: { title: string; description: string }) => void;
}) => {
  if (!transcript) return null;

  const parsedTranscript = transcript.transcript
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const [speaker, ...rest] = line.split(": ");
      const text = rest.join(": ");
      return { id: index, speaker: speaker.trim(), text };
    });

  const handleCopy = () => {
    const transcriptText = parsedTranscript
      .map((line) => `${line.speaker}: ${line.text}`)
      .join("\n");
    navigator.clipboard.writeText(transcriptText);
    toast({
      title: "Copied!",
      description: "The transcript has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Conversation Analysis</DialogTitle>
          <DialogDescription>
            Full transcript between the AI and{" "}
            {transcript.raw_data.customer?.name || "the user"}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4 space-y-4">
          {parsedTranscript.map((line) => (
            <div
              key={line.id}
              className={`flex items-start gap-3 ${
                line.speaker === "AI" ? "" : "justify-end"
              }`}
            >
              {line.speaker === "AI" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-md ${
                  line.speaker === "AI"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{line.text}</p>
              </div>
              {line.speaker === "User" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Transcripts = () => {
  const { admin, loading: adminLoading } = useExpert();
  const { toast } = useToast();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTranscript, setSelectedTranscript] =
    useState<Transcript | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (!admin?.id) {
        console.log("Admin not loaded yet, waiting...");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/vapi/transcripts?admin_id=${admin.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          const updatedTranscripts = result.data.map(
            (transcript: Transcript) => ({
              ...transcript,
              status:
                transcript.status === "ended" ? "completed" : transcript.status,
            })
          );
          setTranscripts(updatedTranscripts);
        } else {
          console.error("Failed to fetch transcripts:", result.error);
        }
      } catch (error) {
        console.error("Error fetching transcripts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!adminLoading) {
      fetchTranscripts();
    }
  }, [admin, adminLoading]);

  const handleAnalyseClick = (transcript: Transcript) => {
    setSelectedTranscript(transcript);
    setIsModalOpen(true);
  };

  const filteredTranscripts = transcripts.filter((transcript) => {
    const customerName =
      transcript.raw_data?.customer?.name?.toLowerCase() || "";
    const matchesSearch = customerName.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      transcript.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-success-foreground";
      case "ended":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "needs_review":
        return "bg-warning text-warning-foreground";
      case "processing":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Star className="h-3 w-3" />;
      case "ended":
        return <FileText className="h-3 w-3" />;
      case "completed":
        return <FileText className="h-3 w-3" />;
      case "needs_review":
        return <Eye className="h-3 w-3" />;
      case "processing":
        return <Clock className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Interview Transcripts
            </h1>
            <p className="text-muted-foreground">
              View, manage, and process interview transcripts
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Transcripts
                </p>
                <p className="text-2xl font-bold">{transcripts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <Star className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">
                  {
                    transcripts.filter(
                      (t) =>
                        t.status === "completed" &&
                        t.ended_reason !==
                          "call.in-progress.error-providerfault-outbound-sip-503-service-unavailable"
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-destructive/20 rounded-lg">
                <Eye className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">
                  {
                    transcripts.filter(
                      (t) =>
                        t.ended_reason ===
                        "call.in-progress.error-providerfault-outbound-sip-503-service-unavailable"
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>
          {/* 
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent rounded-lg">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">
                  $
                  {transcripts
                    .reduce(
                      (acc, t) =>
                        acc +
                        (t.raw_data.costs?.reduce(
                          (cAcc, c) => cAcc + c.cost,
                          0
                        ) || 0),
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </Card> */}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by candidate name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Transcripts List */}
        <div className="space-y-4">
          {filteredTranscripts.map((transcript) => (
            <Card
              key={transcript.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-foreground">
                        Interview with{" "}
                        {transcript.raw_data?.customer?.name || "Unknown"}
                      </h3>
                      <Badge
                        className={getStatusColor(transcript.status)}
                        variant="secondary"
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(transcript.status)}
                          <span>{transcript.status.replace(/_/g, " ")}</span>
                        </div>
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>
                          {transcript.raw_data?.customer?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(transcript.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>
                          {transcript.transcript.split(" ").length} words
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Transcript
                      </DropdownMenuItem>
                      {transcript.recording_url && (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(transcript.recording_url, "_blank")
                          }
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Audio
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAnalyseClick(transcript)}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Analyse Convo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Campaign & Expert Info */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {transcript.raw_data?.customer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {transcript.raw_data?.customer?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transcript.raw_data?.customer?.number}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground">
                      {transcript.status === "ended"
                        ? "completed"
                        : transcript.status}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(transcript.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {/* <div className="text-sm">
                    <p className="font-medium">Total Cost</p>
                    <p className="text-muted-foreground">
                      $
                      {(
                        transcript.raw_data.costs?.reduce(
                          (acc, c) => acc + c.cost,
                          0
                        ) || 0
                      ).toFixed(4)}
                    </p>
                  </div> */}
                </div>

                {/* Key Insights */}
                {transcript.summary && (
                  <div>
                    <p className="text-sm font-medium mb-2">Summary:</p>
                    <p className="text-sm text-muted-foreground">
                      {transcript.summary}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {/* <Button size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full
                  </Button> */}
                  {transcript.recording_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(transcript.recording_url, "_blank")
                      }
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Audio
                    </Button>
                  )}
                  {/* <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button> */}
                  {transcript.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyseClick(transcript)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Analyse Convo
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <ConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transcript={selectedTranscript}
        toast={toast}
      />
    </div>
  );
};

export default Transcripts;

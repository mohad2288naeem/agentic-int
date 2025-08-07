import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useExpert } from "@/contexts/ExpertContext";

interface Transcript {
  id: string;
  summary: string | null;
  created_at: string;
  raw_data: {
    customer?: {
      name?: string;
    };
  };
}

interface TranscriptsListProps {
  className?: string;
}

const truncateSummary = (summary: string | null, wordLimit: number): string => {
  if (!summary) return "";
  const words = summary.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return summary;
};

export const TranscriptsList = ({ className }: TranscriptsListProps) => {
  const { admin, loading: adminLoading } = useExpert();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranscripts = async () => {
      if (!admin?.id) {
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `/api/vapi/transcripts?admin_id=${admin.id}`
        );
        const result = await response.json();
        if (result.success) {
          const summarizedTranscripts = (result.data as Transcript[])
            .filter((t) => t.summary)
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .slice(0, 5);
          setTranscripts(summarizedTranscripts);
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

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Latest Interview Transcripts
        </h3>

        <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <p className="text-muted-foreground">Loading transcripts...</p>
          ) : transcripts.length > 0 ? (
            transcripts.map((transcript) => (
              <Button
                key={transcript.id}
                variant="ghost"
                className="w-full h-auto p-4 justify-start hover:bg-accent/50 transition-colors"
              >
                <div className="w-full text-left space-y-2">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h4 className="font-medium text-foreground truncate">
                        Interview with{" "}
                        {transcript.raw_data?.customer?.name || "Unknown"}
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-normal">
                        {truncateSummary(transcript.summary, 35)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>
                          {transcript.raw_data?.customer?.name ||
                            "Unknown Candidate"}
                        </span>
                        <span>
                          {new Date(transcript.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-muted-foreground">
              No recent transcripts with summaries available.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

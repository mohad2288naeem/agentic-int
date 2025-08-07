import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Expert {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  rating: number;
  interviews: number;
  location: string;
  status: "available" | "busy" | "offline";
  last_interview: string;
  avatar?: string;
  scheduledCalls?: ScheduledCall[];
}

export interface ScheduledCall {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  position: string;
  interview_date: string;
  interview_time: string;
  expert_id: string;
  admin_id: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ExpertContextType {
  experts: Expert[];
  scheduledCalls: ScheduledCall[];
  admin: Admin | null;
  loading: boolean;
  addScheduledCall: (
    call: Omit<ScheduledCall, "id" | "created_at">
  ) => Promise<void>;
  getExpertScheduledCalls: (expertId: string) => ScheduledCall[];
}

const ExpertContext = createContext<ExpertContextType | undefined>(undefined);

export function ExpertProvider({ children }: { children: ReactNode }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [scheduledCalls, setScheduledCalls] = useState<ScheduledCall[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch experts from API
  const fetchExperts = async () => {
    try {
      const response = await fetch("/api/experts");
      const data = await response.json();
      setExperts(data);
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  // Fetch scheduled calls from API
  const fetchScheduledCalls = async () => {
    try {
      const response = await fetch("/api/scheduled-calls");
      const data = await response.json();
      setScheduledCalls(data);
    } catch (error) {
      console.error("Error fetching scheduled calls:", error);
    }
  };

  // Fetch admin from API
  const fetchAdmin = async () => {
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      setAdmin(data);
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchExperts(), fetchScheduledCalls(), fetchAdmin()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const addScheduledCall = async (
    call: Omit<ScheduledCall, "id" | "created_at">
  ) => {
    try {
      const response = await fetch("/api/scheduled-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(call),
      });
      const data = await response.json();
      setScheduledCalls((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding scheduled call:", error);
      throw error;
    }
  };

  const getExpertScheduledCalls = (expertId: string) => {
    return scheduledCalls.filter((call) => call.expert_id === expertId);
  };

  return (
    <ExpertContext.Provider
      value={{
        experts,
        scheduledCalls,
        admin,
        loading,
        addScheduledCall,
        getExpertScheduledCalls,
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
}

export function useExpert() {
  const context = useContext(ExpertContext);
  if (context === undefined) {
    throw new Error("useExpert must be used within an ExpertProvider");
  }
  return context;
}

import { KPICard } from "@/components/dashboard/KPICard";
import { Calendar } from "@/components/dashboard/Calendar";
import { UpcomingCalls } from "@/components/dashboard/UpcomingCalls";
import { TranscriptsList } from "@/components/dashboard/TranscriptsList";

const Index = () => {
  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Total Interviews" value="4" />
          <KPICard title="In Progress" value="2" />
          <KPICard title="Total Experts" value="5" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transcripts */}
          <div className="lg:col-span-1">
            <TranscriptsList />
          </div>

          {/* Middle Column - Upcoming Calls */}
          <div className="lg:col-span-1">
            <UpcomingCalls />
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Schedule
              </h2>
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

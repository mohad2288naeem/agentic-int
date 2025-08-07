import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  className?: string;
}

export const KPICard = ({ title, value, className }: KPICardProps) => {
  return (
    <Card className={cn(
      "p-6 transition-all duration-200 hover:shadow-lg hover:bg-card-hover border-border/50",
      className
    )}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </p>
        <p className="text-3xl font-bold text-foreground">
          {value}
        </p>
      </div>
    </Card>
  );
};
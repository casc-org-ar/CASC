import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/20 text-casc-navy-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-extralight leading-none text-ink">
          {value}
        </p>
        <p className="mt-1 text-sm text-ink-muted">{label}</p>
      </div>
    </Card>
  );
}

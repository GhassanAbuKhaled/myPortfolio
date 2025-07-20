import { cn } from "@/lib/utils"

interface SectionDividerProps {
  label: string;
  className?: string;
}

export function SectionDivider({ label, className }: Readonly<SectionDividerProps>) {
  return (
    <div className={cn("flex items-center my-24", className)}>
      <div className="flex-grow h-px bg-border"></div>
      <div className="mx-4 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {label}
      </div>
      <div className="flex-grow h-px bg-border"></div>
    </div>
  );
}
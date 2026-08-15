import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-surface-secondary p-16 text-center">
      {icon && <div className="mb-5 text-brand-400">{icon}</div>}
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && <p className="mt-2 text-sm text-brand-500 max-w-sm">{description}</p>}
      {action && (
        <Button asChild className="mt-6" variant="outline">
          {action.href ? <a href={action.href}>{action.label}</a> : <button onClick={action.onClick}>{action.label}</button>}
        </Button>
      )}
    </div>
  );
}

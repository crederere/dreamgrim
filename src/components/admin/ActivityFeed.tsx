import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export interface ActivityItem {
  id: string;
  type: "dream" | "order" | "user";
  title: string;
  description: string;
  timestamp: string;
}

function TypeDot({ type }: { type: ActivityItem["type"] }) {
  const colors = {
    dream: "bg-primary-400",
    order: "bg-gold-400",
    user: "bg-fortune-high",
  };
  return <div className={`w-2 h-2 rounded-full ${colors[type]} shrink-0 mt-1.5`} />;
}

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-[13px] text-text-muted/30">
        아직 활동 내역이 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors"
        >
          <TypeDot type={item.type} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-text-secondary/70 truncate">{item.title}</p>
            <p className="text-[11px] text-text-muted/30 mt-0.5">{item.description}</p>
          </div>
          <span className="text-[10px] text-text-muted/25 whitespace-nowrap shrink-0">
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: ko })}
          </span>
        </div>
      ))}
    </div>
  );
}

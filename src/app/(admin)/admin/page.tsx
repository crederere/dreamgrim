"use client";

import { useEffect, useState } from "react";
import { Users, Moon, DollarSign, Crown } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import ActivityFeed, { type ActivityItem } from "@/components/admin/ActivityFeed";

interface DashboardData {
  stats: {
    totalUsers: number;
    todayDreams: number;
    totalRevenue: number;
    activeSubscribers: number;
  };
  activities: ActivityItem[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 h-24 animate-pulse" />
          ))}
        </div>
        <div className="glass rounded-xl h-64 animate-pulse" />
      </div>
    );
  }

  const stats = data?.stats ?? { totalUsers: 0, todayDreams: 0, totalRevenue: 0, activeSubscribers: 0 };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="총 유저" value={stats.totalUsers.toLocaleString()} icon={Users} accent="primary" />
        <StatCard label="오늘 꿈" value={stats.todayDreams.toLocaleString()} icon={Moon} accent="default" />
        <StatCard
          label="총 매출"
          value={`₩${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="gold"
        />
        <StatCard
          label="구독자"
          value={stats.activeSubscribers.toLocaleString()}
          icon={Crown}
          accent="green"
        />
      </div>

      {/* Activity Feed */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-[14px] font-semibold text-text-primary">최근 활동</h2>
        </div>
        <ActivityFeed items={data?.activities ?? []} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import StatCard from "@/components/admin/StatCard";
import { DollarSign, Moon, Users, TrendingUp } from "lucide-react";

const PERIODS = [
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
  { value: "90d", label: "90일" },
];

const STYLE_COLORS: Record<string, string> = {
  watercolor: "#8b6aff",
  oil_painting: "#f5c542",
  digital_art: "#5ee8a0",
  ghibli: "#ff8fa3",
  monochrome: "#94a3b8",
};

const PRODUCT_COLORS = ["#8b6aff", "#f5c542", "#5ee8a0", "#ff8fa3", "#67e8f9", "#fb923c"];

interface AnalyticsData {
  revenueChart: Array<{ date: string; revenue: number }>;
  dreamsChart: Array<{ date: string; count: number }>;
  usersChart: Array<{ date: string; count: number }>;
  styleBreakdown: Array<{ name: string; value: number }>;
  productBreakdown: Array<{ name: string; value: number }>;
  funnel: { totalUsers: number; usersWithDreams: number; paidUsers: number };
  summary: { totalRevenue: number; totalDreams: number; newUsers: number; paidDreams: number };
}

const tooltipStyle = {
  contentStyle: { background: "#0d081e", border: "1px solid rgba(139,106,255,0.15)", borderRadius: 8, fontSize: 12, color: "#b8a6d4" },
  itemStyle: { color: "#ede6f7" },
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-xl h-24 animate-pulse" />)}
        </div>
        <div className="glass rounded-xl h-72 animate-pulse" />
      </div>
    );
  }

  const { summary, funnel } = data;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium border transition-colors ${
              period === p.value
                ? "bg-primary-500/15 text-primary-300 border-primary-500/20"
                : "bg-white/[0.02] text-text-muted/40 border-white/[0.04] hover:text-text-muted/60"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="매출" value={`₩${summary.totalRevenue.toLocaleString()}`} icon={DollarSign} accent="gold" />
        <StatCard label="꿈 생성" value={summary.totalDreams.toLocaleString()} icon={Moon} accent="primary" />
        <StatCard label="신규 유저" value={summary.newUsers.toLocaleString()} icon={Users} accent="green" />
        <StatCard label="유료 전환" value={summary.totalDreams > 0 ? `${Math.round((summary.paidDreams / summary.totalDreams) * 100)}%` : "0%"} icon={TrendingUp} accent="default" />
      </div>

      {/* Revenue chart */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">매출 추이</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7a6899" }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: "#7a6899" }} tickFormatter={(v) => `₩${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...tooltipStyle} formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]} />
            <Line type="monotone" dataKey="revenue" stroke="#f5c542" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dreams trend */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">꿈 생성 추이</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.dreamsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7a6899" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#7a6899" }} />
              <Tooltip {...tooltipStyle} formatter={(v) => [Number(v), "꿈"]} />
              <Bar dataKey="count" fill="#8b6aff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User growth */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">유저 성장</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.usersChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#7a6899" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "#7a6899" }} />
              <Tooltip {...tooltipStyle} formatter={(v) => [Number(v), "신규"]} />
              <Area type="monotone" dataKey="count" stroke="#5ee8a0" fill="#5ee8a0" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Style breakdown */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">스타일 비율</h3>
          {data.styleBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.styleBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {data.styleBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={STYLE_COLORS[entry.name] ?? "#8b6aff"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[13px] text-text-muted/30">데이터 없음</div>
          )}
        </div>

        {/* Conversion funnel */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">전환 퍼널</h3>
          <div className="space-y-4 py-4">
            <FunnelStep label="총 유저" value={funnel.totalUsers} max={funnel.totalUsers} color="bg-primary-400" />
            <FunnelStep label="꿈 생성" value={funnel.usersWithDreams} max={funnel.totalUsers} color="bg-gold-400" />
            <FunnelStep label="유료 전환" value={funnel.paidUsers} max={funnel.totalUsers} color="bg-fortune-high" />
          </div>
        </div>
      </div>

      {/* Product revenue */}
      {data.productBreakdown.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-4">상품별 매출</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.productBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#7a6899" }} tickFormatter={(v) => `₩${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#b8a6d4" }} width={100} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`₩${Number(v).toLocaleString()}`, "매출"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.productBreakdown.map((_, i) => (
                  <Cell key={i} fill={PRODUCT_COLORS[i % PRODUCT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function FunnelStep({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] text-text-secondary/60">{label}</span>
        <span className="text-[12px] text-text-primary font-semibold">{value.toLocaleString()} <span className="text-text-muted/30 font-normal">({pct.toFixed(1)}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

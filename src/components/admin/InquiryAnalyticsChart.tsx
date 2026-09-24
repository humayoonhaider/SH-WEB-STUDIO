import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { api } from '../../services/api';
import { Spinner } from '../common/Loader';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export const InquiryAnalyticsChart: React.FC = () => {
  const [data, setData] = useState<{ daily: any[]; byType: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.inquiries.getAnalytics();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#121318] border border-[#262833] rounded-2xl">
        <Spinner size="sm" label="Loading analytics..." />
      </div>
    );
  }

  if (!data || (data.daily.length === 0 && data.byType.length === 0)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Trends Chart */}
      <div className="lg:col-span-2 bg-[#121318] border border-[#262833] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Inquiry Trends</h3>
            <p className="text-xs text-neutral-400">Daily submission volume (last 30 days)</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262833" vertical={false} />
              <XAxis
                dataKey="_id"
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
                }}
              />
              <YAxis
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17181D',
                  border: '1px solid #262833',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Inquiries"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution by Type */}
      <div className="bg-[#121318] border border-[#262833] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Project Types</h3>
            <p className="text-xs text-neutral-400">Distribution of requests</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byType} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="_id"
                type="category"
                stroke="#A3A3A3"
                fontSize={10}
                width={80}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => str || 'Unknown'}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: '#17181D',
                  border: '1px solid #262833',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]} barSize={20}>
                {data.byType.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

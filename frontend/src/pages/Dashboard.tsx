import { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for demonstration
const kpiData = [
  {
    title: '総売上',
    value: '¥12,450,000',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'blue',
  },
  {
    title: '今月の売上',
    value: '¥2,340,000',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'green',
  },
  {
    title: '顧客数',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'purple',
  },
  {
    title: '商品数',
    value: '456',
    change: '-2.4%',
    trend: 'down',
    icon: Package,
    color: 'orange',
  },
];

const monthlyData = [
  { month: '1月', 売上: 1200000, 利益: 450000 },
  { month: '2月', 売上: 1350000, 利益: 520000 },
  { month: '3月', 売上: 1800000, 利益: 680000 },
  { month: '4月', 売上: 1650000, 利益: 620000 },
  { month: '5月', 売上: 2100000, 利益: 790000 },
  { month: '6月', 売上: 2340000, 利益: 880000 },
];

const categoryData = [
  { name: 'Electronics', value: 4500000, color: '#3b82f6' },
  { name: 'Accessories', value: 3200000, color: '#8b5cf6' },
  { name: 'Storage', value: 2800000, color: '#ec4899' },
  { name: 'Others', value: 1950000, color: '#f59e0b' },
];

const recentSales = [
  {
    id: 1,
    customer: '株式会社ABC',
    amount: 1299990,
    date: '2024-01-15',
    status: 'completed',
  },
  {
    id: 2,
    customer: 'XYZ Inc',
    amount: 159970,
    date: '2024-01-18',
    status: 'completed',
  },
  {
    id: 3,
    customer: 'Tech Solutions',
    amount: 89990,
    date: '2024-01-22',
    status: 'pending',
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
          }[kpi.color];

          return (
            <div
              key={index}
              className="card hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ml-1 ${
                        kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs 先月</span>
                  </div>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="card animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">月次売上推移</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="売上"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="利益"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="card animate-slide-up" style={{ animationDelay: '500ms' }}>
          <h3 className="text-lg font-bold text-gray-900 mb-4">カテゴリ別売上</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `¥${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="card animate-slide-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">最近の売上</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            すべて表示 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sale.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{sale.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sale.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sale.status === 'completed' ? '完了' : '保留中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

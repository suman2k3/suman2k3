import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import client from '../api/client';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const load = async () => {
      const { data: projects } = await client.get('/projects');
      const all = await Promise.all(projects.map((p) => client.get(`/tasks/project/${p._id}`)));
      setTasks(all.flatMap((r) => r.data));
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const pending = tasks.filter((t) => t.status !== 'Done').length;
    const overdue = tasks.filter((t) => t.status !== 'Done' && new Date(t.dueDate) < now).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  const chartData = [
    { name: 'Completed', value: stats.completed, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' }
  ];

  return <div className="space-y-6"><h1 className="text-2xl font-semibold">Dashboard</h1>
    <div className="grid md:grid-cols-4 gap-4">{Object.entries(stats).map(([k,v])=><div key={k} className="bg-white p-4 rounded-xl shadow"><p className="text-slate-500 capitalize">{k} tasks</p><p className="text-2xl font-bold">{v}</p></div>)}</div>
    <div className="bg-white rounded-xl shadow p-4 h-80"><ResponsiveContainer><PieChart><Pie data={chartData} dataKey="value" outerRadius={110}>{chartData.map((e)=><Cell key={e.name} fill={e.color} />)}</Pie></PieChart></ResponsiveContainer></div>
  </div>;
}

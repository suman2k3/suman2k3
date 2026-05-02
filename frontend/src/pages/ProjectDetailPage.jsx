import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('All');
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  const load = async () => {
    const [projectRes, tasksRes] = await Promise.all([client.get(`/projects/${id}`), client.get(`/tasks/project/${id}`)]);
    setProject(projectRes.data); setTasks(tasksRes.data);
  };
  useEffect(() => { load(); }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    await client.post('/tasks', { ...form, projectId: id, status: 'Todo' });
    setForm({ title: '', description: '', assignedTo: '', dueDate: '' });
    load();
  };

  const visible = useMemo(() => tasks.filter((t) => status === 'All' || t.status === status), [tasks, status]);

  const updateStatus = async (task, newStatus) => {
    await client.put(`/tasks/${task._id}`, { status: newStatus });
    load();
  };

  if (!project) return <p>Loading...</p>;
  return <div className="space-y-4"><h1 className="text-2xl font-semibold">{project.title}</h1>
    <p className="text-slate-600">{project.description}</p>
    {user.role === 'admin' && <form onSubmit={createTask} className="bg-white p-4 rounded-xl shadow grid md:grid-cols-2 gap-3">
      <input className="border p-2 rounded" placeholder="Task title" required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
      <input className="border p-2 rounded" placeholder="Assigned user ID" required value={form.assignedTo} onChange={(e)=>setForm({...form,assignedTo:e.target.value})} />
      <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      <input className="border p-2 rounded" type="date" required value={form.dueDate} onChange={(e)=>setForm({...form,dueDate:e.target.value})} />
      <button className="bg-slate-900 text-white rounded p-2">Create Task</button>
    </form>}
    <select className="border p-2 rounded" value={status} onChange={(e)=>setStatus(e.target.value)}><option>All</option><option>Todo</option><option>In Progress</option><option>Done</option></select>
    <div className="space-y-2">{visible.map((task)=><div key={task._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center"><div><p className="font-medium">{task.title}</p><p className="text-sm text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p></div><select className="border p-1 rounded" value={task.status} onChange={(e)=>updateStatus(task,e.target.value)}><option>Todo</option><option>In Progress</option><option>Done</option></select></div>)}</div>
  </div>;
}

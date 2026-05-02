import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', members: '' });
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await client.get('/projects');
    setProjects(data);
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      const members = form.members.split(',').map((x) => x.trim()).filter(Boolean);
      await client.post('/projects', { ...form, members });
      setForm({ title: '', description: '', members: '' });
      load();
    } catch (err) { setError(err.response?.data?.message || 'Could not create project'); }
  };

  return <div className="space-y-6">
    <h1 className="text-2xl font-semibold">Projects</h1>
    {user.role === 'admin' && <form onSubmit={create} className="bg-white p-4 rounded-xl shadow grid md:grid-cols-3 gap-3">
      <input className="border p-2 rounded" placeholder="Project title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
      <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      <input className="border p-2 rounded" placeholder="Member IDs comma-separated" value={form.members} onChange={(e)=>setForm({...form,members:e.target.value})} />
      <button className="bg-slate-900 text-white rounded p-2 md:col-span-3">Create Project</button>
      {error && <p className="text-red-600 text-sm md:col-span-3">{error}</p>}
    </form>}
    <div className="grid md:grid-cols-2 gap-4">{projects.map((p)=><Link key={p._id} to={`/projects/${p._id}`} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"><h3 className="font-semibold">{p.title}</h3><p className="text-sm text-slate-600">{p.description}</p></Link>)}</div>
  </div>;
}

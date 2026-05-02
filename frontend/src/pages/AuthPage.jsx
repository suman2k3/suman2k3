import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const isRegister = useLocation().pathname === '/register';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const path = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await client.post(path, payload);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return <div className="min-h-screen grid place-items-center"><form onSubmit={submit} className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-3">
    <h2 className="text-2xl font-semibold">{isRegister ? 'Sign up' : 'Login'}</h2>
    {isRegister && <input className="w-full border p-2 rounded" placeholder="Name" required onChange={(e)=>setForm({...form,name:e.target.value})} />}
    <input className="w-full border p-2 rounded" placeholder="Email" type="email" required onChange={(e)=>setForm({...form,email:e.target.value})} />
    <input className="w-full border p-2 rounded" placeholder="Password" type="password" required onChange={(e)=>setForm({...form,password:e.target.value})} />
    {isRegister && <select className="w-full border p-2 rounded" onChange={(e)=>setForm({...form,role:e.target.value})}><option value="member">Member</option><option value="admin">Admin</option></select>}
    {error && <p className="text-red-600 text-sm">{error}</p>}
    <button disabled={loading} className="w-full bg-slate-900 text-white p-2 rounded">{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}</button>
    <p className="text-sm">{isRegister ? 'Already have account?' : 'Need account?'} <Link to={isRegister ? '/login' : '/register'} className="text-blue-600">{isRegister ? 'Login' : 'Register'}</Link></p>
  </form></div>;
}

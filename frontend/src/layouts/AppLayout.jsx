import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white p-5 space-y-3">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <button onClick={logout} className="text-left text-red-300">Logout</button>
        </nav>
        <p className="text-xs text-slate-300">{user?.name} ({user?.role})</p>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

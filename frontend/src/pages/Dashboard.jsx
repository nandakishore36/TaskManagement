import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks/me'),
          api.get('/projects')
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="container">Loading dashboard...</div>;

  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const progressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const overdueTasks = tasks.filter(t => t.status === 'Overdue').length;

  return (
    <div>
      <nav className="navbar">
        <div className="auth-title" style={{ margin: 0, fontSize: '1.5rem' }}>TeamTask</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/tasks" className="nav-link">My Tasks</Link>
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>{user.username} ({user.role})</span>
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user.username}!</h1>
        
        <div className="grid" style={{ marginBottom: '3rem' }}>
          <div className="card" style={{ borderTop: '4px solid var(--warning-color)' }}>
            <div className="card-title">Pending</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{pendingTasks}</div>
          </div>
          <div className="card" style={{ borderTop: '4px solid #3b82f6' }}>
            <div className="card-title">In Progress</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{progressTasks}</div>
          </div>
          <div className="card" style={{ borderTop: '4px solid var(--success-color)' }}>
            <div className="card-title">Completed</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{completedTasks}</div>
          </div>
          <div className="card" style={{ borderTop: '4px solid var(--danger-color)' }}>
            <div className="card-title">Overdue</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{overdueTasks}</div>
          </div>
        </div>

        <div className="grid">
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem' }}>Recent Projects</h2>
            {projects.length === 0 ? <p>No projects found.</p> : (
              <ul style={{ listStyle: 'none' }}>
                {projects.slice(0, 5).map(project => (
                  <li key={project._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex-between">
                      <strong>{project.title}</strong>
                      <Link to={`/projects/${project._id}`} className="nav-link" style={{ fontSize: '0.875rem' }}>View</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/projects" className="btn" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'block' }}>View All Projects</Link>
          </div>

          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem' }}>My Recent Tasks</h2>
            {tasks.length === 0 ? <p>No tasks assigned to you.</p> : (
              <ul style={{ listStyle: 'none' }}>
                {tasks.slice(0, 5).map(task => (
                  <li key={task._id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="flex-between">
                      <div>
                        <strong>{task.title}</strong>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project: {task.project?.title || 'Unknown'}</div>
                      </div>
                      <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/tasks" className="btn" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'block' }}>View All Tasks</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

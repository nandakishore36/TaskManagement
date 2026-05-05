import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/me');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container">Loading tasks...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="auth-title" style={{ margin: 0, fontSize: '1.5rem' }}>TeamTask</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/tasks" className="nav-link" style={{ color: 'var(--primary-color)' }}>My Tasks</Link>
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>{user?.username}</span>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>My Assigned Tasks</h1>

        {tasks.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>No Tasks Assigned</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You currently have no tasks assigned to you.</p>
          </div>
        ) : (
          <div className="grid">
            {tasks.map(task => (
              <div key={task._id} className="card" style={{ borderLeft: task.status === 'Overdue' ? '4px solid var(--danger-color)' : 'none' }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <div className="card-title">{task.title}</div>
                  <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  Project: {task.project?.title || 'Unknown Project'}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>{task.description}</p>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Update Status:</label>
                  <select 
                    className="form-control" 
                    style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

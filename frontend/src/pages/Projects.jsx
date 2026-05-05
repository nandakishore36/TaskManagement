import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects', { title, description });
      setProjects([...projects, res.data]);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating project');
    }
  };

  if (loading) return <div className="container">Loading projects...</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="auth-title" style={{ margin: 0, fontSize: '1.5rem' }}>TeamTask</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link" style={{ color: 'var(--primary-color)' }}>Projects</Link>
          <Link to="/tasks" className="nav-link">My Tasks</Link>
          <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>{user?.username} ({user?.role})</span>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h1>Projects</h1>
          {user?.role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
          )}
        </div>

        {showModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
          }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Create Project</h2>
              {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows="4" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="flex-between" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>No Projects Found</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You are not part of any projects yet.</p>
          </div>
        ) : (
          <div className="grid">
            {projects.map(project => (
              <div key={project._id} className="card">
                <div className="card-title">{project.title}</div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '3rem' }}>
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex-between" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  <span>Created by: {project.createdBy?.username || 'Unknown'}</span>
                  <span>Members: {project.members?.length || 0}</span>
                </div>
                <Link to={`/projects/${project._id}`} className="btn btn-primary" style={{ width: '100%', display: 'block', padding: '0.5rem 1rem' }}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

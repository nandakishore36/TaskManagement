import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [error, setError] = useState('');

  // Member Modal State
  const [allUsers, setAllUsers] = useState([]);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get('/auth/users')
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error loading project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        project: id,
        dueDate: taskDueDate,
        assignedTo: taskAssignedTo || undefined
      });
      setTasks([...tasks, res.data]);
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      setTaskAssignedTo('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      const res = await api.put(`/projects/${id}/members`, { userId: selectedUserId });
      setProject(res.data);
      setShowMemberModal(false);
      setSelectedUserId('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding member');
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

  if (loading) return <div className="container">Loading project details...</div>;
  if (!project) return <div className="container">Project not found or access denied.</div>;

  return (
    <div>
      <nav className="navbar">
        <div className="auth-title" style={{ margin: 0, fontSize: '1.5rem' }}>TeamTask</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/projects" className="nav-link" style={{ color: 'var(--primary-color)' }}>Projects</Link>
          <Link to="/tasks" className="nav-link">My Tasks</Link>
        </div>
      </nav>

      <div className="container">
        <Link to="/projects" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>&larr; Back to Projects</Link>
        
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{project.description}</p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
            <div><strong style={{ color: 'white' }}>Created By:</strong> {project.createdBy?.username}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div><strong style={{ color: 'white' }}>Members:</strong> {project.members?.length}</div>
              {(user?.role === 'Admin' || project.createdBy?._id === user?._id) && (
                <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: 'var(--primary-color)', color: 'white' }} onClick={() => setShowMemberModal(true)}>+ Add Member</button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2>Project Tasks</h2>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>+ New Task</button>
        </div>

        {showTaskModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
          }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Create Task</h2>
              {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
              <form onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" value={taskDesc} onChange={e => setTaskDesc(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-control" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select className="form-control" value={taskAssignedTo} onChange={e => setTaskAssignedTo(e.target.value)}>
                    <option value="">-- Unassigned --</option>
                    {project?.members?.map(member => (
                      <option key={member._id} value={member._id}>{member.username}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-between" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn" onClick={() => setShowTaskModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMemberModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
          }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Add Member to Project</h2>
              {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label>Select User</label>
                  <select className="form-control" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} required>
                    <option value="">-- Choose a user --</option>
                    {allUsers
                      .filter(u => !project.members?.some(m => m._id === u._id || m === u._id))
                      .map(u => (
                      <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex-between" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn" onClick={() => setShowMemberModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Member</button>
                </div>
              </form>
            </div>
          </div>
        )}


        {tasks.length === 0 ? (
          <p>No tasks found for this project.</p>
        ) : (
          <div className="grid">
            {tasks.map(task => (
              <div key={task._id} className="card">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <div className="card-title">{task.title}</div>
                  <span className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                  Assigned To: {task.assignedTo?.username || 'Unassigned'}
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

export default ProjectDetails;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const categories = ['All', 'Branding', 'Logo Design', 'Posters', 'Social Media', 'UI Design', 'Packaging', 'Motion'];
const layoutOptions = ['portrait', 'landscape', 'square', 'wide'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Branding',
    description: '',
    layout: 'landscape',
    image: null,
    video: null
  });

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    navigate('/login');
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        layout: project.layout || 'landscape',
        image: null,
        video: null
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: 'Branding',
        description: '',
        layout: 'landscape',
        image: null,
        video: null
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('layout', formData.layout);
    if (formData.image) data.append('image', formData.image);
    if (formData.video) data.append('video', formData.video);

    const url = editingProject 
      ? `http://localhost:5000/api/projects/${editingProject._id}`
      : `http://localhost:5000/api/projects`;
      
    const method = editingProject ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (res.ok) {
        await fetchProjects();
        closeModal();
        toast.success(editingProject ? 'Project updated!' : 'Project created!');
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred. Make sure your server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
        toast.success('Project deleted successfully!');
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error during deletion');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">View Live Site</a>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Projects</h2>
            <p className="text-slate-500">Manage your portfolio projects, images, and details.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-colors font-semibold flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 mb-4">You have no projects yet.</p>
            <button onClick={() => openModal()} className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-xl font-medium hover:bg-sky-100 transition-colors">Create First Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-100 relative overflow-hidden group">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  {project.video && (
                    <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                      VIDEO
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-1">{project.category}</span>
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 flex-1 mb-6">{project.description}</p>
                  
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => openModal(project)}
                      className="flex-1 px-3 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="flex-1 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Layout Type</label>
                  <select name="layout" value={formData.layout} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white">
                    {layoutOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white resize-none" />
                </div>

                <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-4">Media Uploads</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cover Image {editingProject && <span className="text-xs text-sky-500 ml-2 font-normal">(Optional: Leave empty to keep existing)</span>}
                        {!editingProject && <span className="text-xs text-rose-500 ml-1">*</span>}
                      </label>
                      <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Video File <span className="text-xs text-slate-400 ml-2 font-normal">(Optional MP4)</span>
                      </label>
                      <input type="file" name="video" accept="video/mp4,video/mkv" onChange={handleInputChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white shadow-[0_-20px_20px_-15px_rgba(255,255,255,1)]">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md disabled:bg-sky-300 flex items-center gap-2">
                  {isSubmitting && (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  )}
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

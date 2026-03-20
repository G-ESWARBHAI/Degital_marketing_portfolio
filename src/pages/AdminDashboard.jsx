import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../config';

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
      const res = await fetch(`${API_URL}/api/projects`);
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
      ? `${API_URL}/api/projects/${editingProject._id}`
      : `${API_URL}/api/projects`;
      
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
      const res = await fetch(`${API_URL}/api/projects/${id}`, {
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
      <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">Admin Dashboard</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <a href="/" className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-2">View Live Site</a>
          <button 
            onClick={handleLogout}
            className="px-3 py-2 sm:px-4 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">Projects</h2>
            <p className="text-sm sm:text-base text-slate-500">Manage your portfolio projects, images, and details.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-800 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-xl leading-none">+</span> New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-20 text-slate-500 text-sm sm:text-base">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 mb-4 text-sm sm:text-base">You have no projects yet.</p>
            <button onClick={() => openModal()} className="px-5 py-2.5 bg-sky-50 text-sky-600 rounded-xl font-medium hover:bg-sky-100 transition-colors text-sm sm:text-base">Create First Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-video bg-slate-100 relative overflow-hidden group">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  {project.video && (
                    <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                      VIDEO
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-1">{project.category}</span>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 flex-1 mb-4 sm:mb-6">{project.description}</p>
                  
                  <div className="flex gap-2 pt-3 sm:pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => openModal(project)}
                      className="flex-1 px-3 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="flex-1 px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs sm:text-sm font-medium transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] sm:my-8 overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button onClick={closeModal} className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors shrink-0" aria-label="Close">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white text-base" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white text-base">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Layout Type</label>
                  <select name="layout" value={formData.layout} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white text-base">
                    {layoutOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 focus:bg-white resize-none text-base" />
                </div>

                <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">Media Uploads</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Cover Image {editingProject && <span className="text-xs text-sky-500 ml-1 sm:ml-2 font-normal hidden sm:inline">(Optional: Leave empty to keep existing)</span>}
                        {!editingProject && <span className="text-xs text-rose-500 ml-1">*</span>}
                      </label>
                      <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="w-full text-xs sm:text-sm text-slate-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Video File <span className="text-xs text-slate-400 ml-1 sm:ml-2 font-normal hidden sm:inline">(Optional MP4)</span>
                      </label>
                      <input type="file" name="video" accept="video/mp4,video/mkv" onChange={handleInputChange} className="w-full text-xs sm:text-sm text-slate-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 pb-4 sm:pb-0 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white shadow-[0_-20px_20px_-15px_rgba(255,255,255,1)] shrink-0">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors text-sm sm:text-base">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-md disabled:bg-sky-300 flex items-center justify-center gap-2 text-sm sm:text-base">
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

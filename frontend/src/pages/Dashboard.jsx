// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useApplications } from "../context/ApplicationContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  FiPlus, FiFilter, FiSearch, FiTrash2, FiExternalLink, 
  FiUser, FiBriefcase, FiAward, FiX, FiEdit3 
} from "react-icons/fi";

const stages = ["Applied", "Interview", "Offer", "Rejected"];
const stageColors = {
  Applied: "from-blue-500 to-blue-700",
  Interview: "from-amber-500 to-amber-700",
  Offer: "from-emerald-500 to-emerald-700",
  Rejected: "from-rose-500 to-rose-700",
};

const stageIcons = {
  Applied: <FiUser className="inline mr-1" size={16} />,
  Interview: <FiBriefcase className="inline mr-1" size={16} />,
  Offer: <FiAward className="inline mr-1" size={16} />,
  Rejected: <FiX className="inline mr-1" size={16} />,
};

const Dashboard = () => {
  const { applications, getApplications, addApplication, updateStatus, deleteApplication, updateApplication } = useApplications();

  const [form, setForm] = useState({ 
    candidateName: "", 
    role: "", 
    yearsOfExperience: "", 
    resumeLink: "", 
    status: "Applied" 
  });
  const [filter, setFilter] = useState({ 
    role: "", 
    status: "", 
    minExp: "", 
    maxExp: "",
    search: "" 
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    getApplications(filter);
  }, [filter]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.candidateName || !form.role || !form.yearsOfExperience || !form.resumeLink) return;
    
    if (editingId) {
      updateApplication(editingId, form);
      setEditingId(null);
    } else {
      addApplication(form);
    }
    
    setForm({ candidateName: "", role: "", yearsOfExperience: "", resumeLink: "", status: "Applied" });
    setIsFormOpen(false);
  };
  
  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });
  
  const handleEdit = (app) => {
    setForm({
      candidateName: app.candidateName,
      role: app.role,
      yearsOfExperience: app.yearsOfExperience,
      resumeLink: app.resumeLink,
      status: app.status
    });
    setEditingId(app._id);
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setForm({ candidateName: "", role: "", yearsOfExperience: "", resumeLink: "", status: "Applied" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const safeApplications = Array.isArray(applications) ? applications : [];
  
  // Filter applications based on search term
  const filteredApplications = safeApplications.filter(app => {
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        app.candidateName.toLowerCase().includes(searchTerm) ||
        app.role.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
  
  const groupedApps = stages.reduce((acc, stage) => {
    acc[stage] = filteredApplications.filter(app => app.status === stage);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const newStage = destination.droppableId;
    if (newStage !== source.droppableId) {
      updateStatus(draggableId, newStage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage candidate applications efficiently</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white"
          >
            <FiFilter size={18} />
            <span>Filters</span>
          </button>
          
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <FiPlus size={18} />
            <span>Add Candidate</span>
          </button>
        </div>
      </header>

      {/* Add Application Form - Modal Style */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Candidate" : "Add New Candidate"}
              </h2>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-200">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Candidate Name</label>
                <input 
                  type="text" 
                  name="candidateName" 
                  value={form.candidateName} 
                  onChange={handleChange} 
                  placeholder="Full name" 
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
                <input 
                  type="text" 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange} 
                  placeholder="Position applying for" 
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Years of Experience</label>
                <input 
                  type="number" 
                  name="yearsOfExperience" 
                  value={form.yearsOfExperience} 
                  onChange={handleChange} 
                  placeholder="0" 
                  min="0"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Resume Link</label>
                <input 
                  type="url" 
                  name="resumeLink" 
                  value={form.resumeLink} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 p-3 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                >
                  {editingId ? "Update Candidate" : "Add Candidate"}
                </button>
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="px-4 py-3 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters - Expandable */}
      {showFilters && (
        <div className="bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
              <input 
                type="text" 
                name="role" 
                placeholder="Filter by role" 
                value={filter.role} 
                onChange={handleFilterChange} 
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
              <select 
                name="status" 
                value={filter.status} 
                onChange={handleFilterChange} 
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Min Experience</label>
              <input 
                type="number" 
                name="minExp" 
                placeholder="Min years" 
                value={filter.minExp} 
                onChange={handleFilterChange} 
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Max Experience</label>
              <input 
                type="number" 
                name="maxExp" 
                placeholder="Max years" 
                value={filter.maxExp} 
                onChange={handleFilterChange} 
                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setFilter({ role: "", status: "", minExp: "", maxExp: "", search: "" })}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map(stage => (
            <Droppable droppableId={stage} key={stage}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-gray-800 rounded-xl shadow-sm border border-gray-700 min-h-[500px] flex flex-col transition-all ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-500' : ''}`}
                >
                  <div className={`p-4 rounded-t-xl text-white font-bold bg-gradient-to-r ${stageColors[stage]}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        {stageIcons[stage]}
                        {stage}
                      </div>
                      <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-sm">
                        {groupedApps[stage].length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {groupedApps[stage].length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No applications</p>
                      </div>
                    ) : (
                      groupedApps[stage].map((app, index) => (
                        <Draggable key={app._id} draggableId={app._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-900 p-4 rounded-lg shadow border border-gray-700 hover:shadow-md transition-all duration-200 cursor-grab ${
                                snapshot.isDragging ? "rotate-2 shadow-lg" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-semibold text-lg truncate">{app.candidateName}</div>
                                <button 
                                  onClick={() => handleEdit(app)}
                                  className="text-gray-400 hover:text-indigo-400 p-1"
                                >
                                  <FiEdit3 size={16} />
                                </button>
                              </div>
                              
                              <div className="text-sm text-gray-400 mb-2">
                                {app.role}
                              </div>
                              
                              <div className="flex justify-between items-center mb-3">
                                <span className="bg-gray-700 text-gray-200 px-2 py-1 rounded text-xs font-medium">
                                  {app.yearsOfExperience} years exp
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <a 
                                  href={app.resumeLink} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                                >
                                  <FiExternalLink className="mr-1" size={14} />
                                  View Resume
                                </a>
                                <button 
                                  onClick={() => deleteApplication(app._id)} 
                                  className="text-rose-500 hover:text-rose-400 p-1"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;

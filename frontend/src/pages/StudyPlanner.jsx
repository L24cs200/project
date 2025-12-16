import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiTrash2, FiClock, FiBook, FiCpu, FiPlayCircle, FiMoreHorizontal 
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// Eisenhower Matrix Columns
const COLUMNS = {
  do_first: { title: 'Do First', color: 'bg-red-50 text-red-700 border-red-200', icon: '🔥' },
  schedule: { title: 'Schedule', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📅' },
  delegate: { title: 'Delegate', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🤝' },
  delete:   { title: 'Delete',   color: 'bg-gray-100 text-gray-600 border-gray-300',   icon: '🗑️' }
};

const StudyPlanner = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // AI State
  const [loadingAI, setLoadingAI] = useState(null);
  const [taskSteps, setTaskSteps] = useState({});

  const [newTask, setNewTask] = useState({
    title: '', subject: '', priority: 'do_first', dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/planner');
      setTasks(res.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/planner', newTask);
      setTasks([...tasks, res.data]);
      setShowForm(false);
      setNewTask({ title: '', subject: '', priority: 'do_first', dueDate: format(new Date(), 'yyyy-MM-dd') });
    } catch (err) { alert("Error adding task"); }
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Delete this task permanently?")) return;
    try {
      await api.delete(`/planner/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  // --- DRAG AND DROP HANDLER ---
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 1. Optimistic UI Update
    const updatedTasks = tasks.map(t => 
      t._id === draggableId ? { ...t, priority: destination.droppableId } : t
    );
    setTasks(updatedTasks);

    // 2. API Update (We recycle the completion endpoint or use a specific update endpoint)
    // Since we didn't write a specific 'update priority' endpoint, we will use the existing POST/PUT logic
    // But typically in a CRUD app, we'd have a specific patch. 
    // For this demo, we assume we might need to add a small PUT route or just re-save.
    // Let's assume we call a PUT endpoint to update priority.
    try {
       // We need to extend the backend PUT route to accept body updates, 
       // OR we delete and re-create (hacky). 
       // BEST WAY: Update the backend PUT route to handle body updates.
       // See the Backend Update instruction below this code block.
       await api.put(`/planner/${draggableId}`, { priority: destination.droppableId });
    } catch (err) {
       console.error("Failed to save move");
       fetchTasks(); // Revert on error
    }
  };

  // --- AI & FOCUS Features ---
  const handleAiBreakdown = async (task) => {
    if (taskSteps[task._id]) return;
    setLoadingAI(task._id);
    try {
      const res = await api.post('/planner/ai-breakdown', { taskTitle: task.title, subject: task.subject });
      setTaskSteps({ ...taskSteps, [task._id]: res.data.steps });
    } catch (err) { alert("AI Busy"); } finally { setLoadingAI(null); }
  };

  const startFocus = (task) => {
    navigate('/visualizer', { state: { taskName: task.title } });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Eisenhower Planner</h1>
          <p className="text-gray-500">Prioritize tasks by Urgency and Importance.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="mt-4 md:mt-0 bg-indigo-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition">
          <FiPlus /> New Task
        </button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-indigo-100 animate-in slide-in-from-top-4">
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="p-3 border rounded-lg" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
            <input className="p-3 border rounded-lg" placeholder="Subject" value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} required />
            <select className="p-3 border rounded-lg bg-white" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
              <option value="do_first">Do First (Urgent & Important)</option>
              <option value="schedule">Schedule (Important, Not Urgent)</option>
              <option value="delegate">Delegate (Urgent, Not Important)</option>
              <option value="delete">Delete (Neither)</option>
            </select>
            <button type="submit" className="bg-slate-800 text-white font-bold rounded-lg">Add Task</button>
          </form>
        </div>
      )}

      {/* --- DRAG & DROP BOARD --- */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {Object.entries(COLUMNS).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100/50 p-4 rounded-xl min-h-[500px] flex flex-col"
                >
                  {/* Column Header */}
                  <div className={`p-3 rounded-lg mb-4 flex items-center justify-between border ${column.color} bg-white shadow-sm`}>
                    <span className="font-bold flex items-center gap-2">{column.icon} {column.title}</span>
                    <span className="bg-white/50 px-2 py-0.5 rounded text-sm font-bold">
                      {tasks.filter(t => t.priority === columnId).length}
                    </span>
                  </div>

                  {/* Tasks in Column */}
                  <div className="space-y-3 flex-1">
                    {tasks.filter(t => t.priority === columnId).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 group hover:shadow-md transition ${snapshot.isDragging ? "rotate-2 scale-105 shadow-xl ring-2 ring-indigo-400" : ""}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800">{task.title}</h4>
                              <button onClick={() => deleteTask(task._id)} className="text-gray-300 hover:text-red-500"><FiTrash2 /></button>
                            </div>
                            
                            <p className="text-xs text-gray-500 flex items-center gap-2 mb-3">
                              <FiBook /> {task.subject}
                              <span>•</span>
                              <FiClock /> {format(parseISO(task.dueDate), 'MMM do')}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {columnId === 'do_first' && (
                                <button onClick={() => startFocus(task)} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded text-xs font-bold flex justify-center items-center gap-1 transition">
                                  <FiPlayCircle /> Focus
                                </button>
                              )}
                              <button onClick={() => handleAiBreakdown(task)} className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-1.5 rounded text-xs font-bold flex justify-center items-center gap-1 transition">
                                {loadingAI === task._id ? "..." : <FiCpu />} Steps
                              </button>
                            </div>

                            {/* AI Steps Expansion */}
                            {taskSteps[task._id] && (
                              <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in">
                                <p className="text-xs font-bold text-indigo-800 mb-1">AI Steps:</p>
                                <ul className="list-disc list-inside text-xs text-gray-600">
                                  {taskSteps[task._id].map((step, i) => <li key={i}>{step}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
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

export default StudyPlanner;
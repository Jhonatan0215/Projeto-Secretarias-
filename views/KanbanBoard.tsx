
import React, { useState } from 'react';
import { Task, TaskStatus, UrgencyLevel, UserRole } from '../types';
import { COLORS } from '../constants';
import { Clock, MapPin, Plus, Trash2, ArrowRight, X, Building2, GripVertical } from 'lucide-react';

interface Props {
  role: UserRole;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanBoard: React.FC<Props> = ({ role, tasks, onAddTask, onUpdateStatus, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  
  const [newTask, setNewTask] = useState({
    titulo: '',
    obraNome: '',
    local: '',
    nivel: UrgencyLevel.PREVENTIVA
  });

  const isSecretario = role === UserRole.SECRETARIO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      id: Math.random().toString(36).substr(2, 9),
      ...newTask,
      status: TaskStatus.A_FAZER,
      dataCriacao: new Date().toISOString()
    });
    setIsModalOpen(false);
    setNewTask({ titulo: '', obraNome: '', local: '', nivel: UrgencyLevel.PREVENTIVA });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (isSecretario) return;
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Feedback visual imediato ao começar a arrastar
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    if (isSecretario) return;
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    if (isSecretario) return;
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onUpdateStatus(taskId, status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch(level) {
      case UrgencyLevel.EMERGENCIAL:
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight">EMERGENCIAL (2H)</span>;
      case UrgencyLevel.URGENCIA:
        return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight">URGÊNCIA (24H)</span>;
      case UrgencyLevel.PREVENTIVA:
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight">PREVENTIVA (15D)</span>;
    }
  };

  const columns = [
    { id: TaskStatus.A_FAZER, title: 'Pendentes' },
    { id: TaskStatus.EM_EXECUCAO, title: 'Em Execução' },
    { id: TaskStatus.CONCLUIDO, title: 'Concluídos' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Gestão de Manutenções por Obra</h3>
          <p className="text-xs font-bold text-gray-400">Total de {tasks.length} notificações ativas. Arraste e solte os cards para atualizar o status.</p>
        </div>
        {!isSecretario && (role === UserRole.FISCAL || role === UserRole.DIRETOR) && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-100 active:scale-95 transition-all"
            style={{ backgroundColor: COLORS.CUIABA_GREEN }}
          >
            <Plus className="w-5 h-5" /> NOVA SOLICITAÇÃO
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div 
            key={col.id} 
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`rounded-3xl p-4 flex flex-col gap-4 min-h-[600px] border transition-all duration-300 ${
              dragOverColumn === col.id 
              ? 'bg-green-50/50 border-green-200 scale-[1.01] shadow-inner' 
              : 'bg-gray-100/40 border-gray-100'
            }`}
          >
            <div className={`flex items-center justify-between px-4 py-2 bg-white/50 backdrop-blur rounded-2xl border transition-colors ${
              dragOverColumn === col.id ? 'border-green-200 text-green-700' : 'border-white text-gray-500'
            }`}>
              <h4 className="font-black uppercase tracking-widest text-[10px]">{col.title}</h4>
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[700px] pr-1 scrollbar-hide">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  draggable={!isSecretario}
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
                    !isSecretario ? 'cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-1' : ''
                  } ${draggedTaskId === task.id ? 'opacity-20 scale-95 border-dashed border-gray-300' : 'opacity-100'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {!isSecretario && <GripVertical className="w-3 h-3 text-gray-300 group-hover:text-gray-400 transition-colors" />}
                      {getUrgencyBadge(task.nivel)}
                    </div>
                    {!isSecretario && (
                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Nome da Obra em Destaque - PRIORIDADE VISUAL */}
                  <div className="flex items-center gap-2 mb-3 p-2.5 bg-green-50/80 rounded-xl border border-green-100/50 shadow-sm transition-colors group-hover:bg-green-100/80">
                    <div className="p-1.5 bg-green-600 rounded-lg shadow-sm">
                      <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-black text-green-900 uppercase tracking-tight truncate">{task.obraNome}</span>
                  </div>

                  <h5 className="font-black text-gray-900 mb-1 leading-tight text-sm group-hover:text-green-700 transition-colors">{task.titulo}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-300" /> {task.local}
                  </p>
                  
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Abertura em</span>
                      <span className="text-[10px] font-black text-gray-600">{new Date(task.dataCriacao).toLocaleDateString()}</span>
                    </div>
                    
                    {!isSecretario && task.status !== TaskStatus.CONCLUIDO && (
                      <button 
                        onClick={() => onUpdateStatus(task.id, task.status === TaskStatus.A_FAZER ? TaskStatus.EM_EXECUCAO : TaskStatus.CONCLUIDO)}
                        className="px-3 py-1.5 bg-gray-50 text-gray-400 hover:bg-green-600 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase flex items-center gap-1 active:scale-90"
                      >
                        Avançar <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal remains the same */}
      {isModalOpen && !isSecretario && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-black text-gray-800 uppercase tracking-tight">Nova Ordem de Serviço</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-100 transition-all active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Qual a Escola / Obra?</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-sm"
                  placeholder="Ex: EMEB Juvina de Oliveira"
                  value={newTask.obraNome}
                  onChange={e => setNewTask({...newTask, obraNome: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Descrição da Urgência</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-sm"
                  placeholder="Ex: Curto-circuito no Bloco A"
                  value={newTask.titulo}
                  onChange={e => setNewTask({...newTask, titulo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Nível de Criticidade</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-black text-xs uppercase"
                  value={newTask.nivel}
                  onChange={e => setNewTask({...newTask, nivel: e.target.value as UrgencyLevel})}
                >
                  <option value={UrgencyLevel.EMERGENCIAL}>Emergencial (2 horas)</option>
                  <option value={UrgencyLevel.URGENCIA}>Urgência (1 dia)</option>
                  <option value={UrgencyLevel.PREVENTIVA}>Preventiva (15 dias)</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 active:scale-95 transition-all mt-6 uppercase text-xs tracking-widest"
              >
                CRIAR CHAMADO GEORREFERENCIADO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;

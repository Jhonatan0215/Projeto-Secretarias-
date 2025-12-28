
import React, { useState, useEffect } from 'react';
import { UserRole, SinapiItem, Task, TaskStatus, UrgencyLevel } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import MeasurementTable from './views/Measurements';
import KanbanBoard from './views/KanbanBoard';
import PhotoReports from './views/PhotoReports';
import AuditoriaView from './views/Auditoria';
import { COLORS, MOCK_SINAPI, MOCK_TASKS } from './constants';
import { LogIn, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Lifted States
  const [sinapiItems, setSinapiItems] = useState<SinapiItem[]>(MOCK_SINAPI);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveView('dashboard');
  };

  const updateSinapiItem = (index: number, field: keyof SinapiItem, value: number) => {
    setSinapiItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl relative z-10 border border-gray-100">
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 bg-gray-50 rounded-2xl mb-4 border border-gray-100">
                <img 
                    src="https://www.cuiaba.mt.gov.br/images/logo_prefeitura_cuiaba.png" 
                    alt="Logo Cuiabá" 
                    className="h-16 object-contain"
                />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">SISTEMA DE GESTÃO DE OBRAS</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Educação Cuiabá</p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Selecione seu acesso:</p>
            {[
              { role: UserRole.SECRETARIO, label: 'Secretário Municipal' },
              { role: UserRole.DIRETOR, label: 'Diretor de Engenharia' },
              { role: UserRole.FISCAL, label: 'Fiscal da Secretaria' },
              { role: UserRole.EMPRESA, label: 'Empresa Contratada' },
              { role: UserRole.ORGAO_INTERNO, label: 'Órgão de Controle externo' },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => handleLogin(item.role)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-500 hover:bg-green-50 group transition-all"
              >
                <span className="font-bold text-gray-700 group-hover:text-green-800">{item.label}</span>
                <LogIn className="w-5 h-5 text-gray-300 group-hover:text-green-600" />
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 justify-center py-3 bg-red-50 rounded-xl text-red-600">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Acesso Monitorado</span>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard role={userRole} tasks={tasks} items={sinapiItems} />;
      case 'medicao': return (
        <MeasurementTable 
          role={userRole} 
          items={sinapiItems} 
          onUpdate={updateSinapiItem} 
        />
      );
      case 'kanban': return (
        <KanbanBoard 
          role={userRole} 
          tasks={tasks} 
          onAddTask={addTask} 
          onUpdateStatus={updateTaskStatus} 
          onDeleteTask={deleteTask}
        />
      );
      case 'fotos': return <PhotoReports items={sinapiItems} />;
      case 'auditoria': return <AuditoriaView items={sinapiItems} tasks={tasks} />;
      default: return <Dashboard role={userRole} tasks={tasks} items={sinapiItems} />;
    }
  };

  return (
    <Layout 
      userRole={userRole} 
      onLogout={handleLogout} 
      activeView={activeView} 
      setActiveView={setActiveView}
    >
      {renderView()}
    </Layout>
  );
};

export default App;

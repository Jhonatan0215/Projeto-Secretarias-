
import React from 'react';
import { UserRole } from '../types';
import { COLORS } from '../constants';
import { 
  LayoutDashboard, 
  Ruler, 
  AlertTriangle, 
  Camera, 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  Building2,
  Map as MapIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.SECRETARIO, UserRole.DIRETOR, UserRole.FISCAL, UserRole.EMPRESA, UserRole.ORGAO_INTERNO] },
    { id: 'medicao', label: 'Medições SINAPI', icon: Ruler, roles: [UserRole.SECRETARIO, UserRole.DIRETOR, UserRole.FISCAL, UserRole.EMPRESA] },
    { id: 'kanban', label: 'Manutenção & Urgência', icon: AlertTriangle, roles: [UserRole.SECRETARIO, UserRole.DIRETOR, UserRole.FISCAL, UserRole.EMPRESA] },
    { id: 'fotos', label: 'Relatórios Fotográficos', icon: Camera, roles: [UserRole.FISCAL, UserRole.EMPRESA, UserRole.ORGAO_INTERNO] },
    { id: 'auditoria', label: 'Mapa de Monitoramento', icon: ShieldCheck, roles: [UserRole.ORGAO_INTERNO, UserRole.SECRETARIO, UserRole.DIRETOR] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shadow-2xl z-10" style={{ backgroundColor: COLORS.CUIABA_GREEN }}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="p-2 bg-white rounded-lg">
            <Building2 className="w-6 h-4" style={{ color: COLORS.CUIABA_GREEN }} />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">PREFEITURA DE</h1>
            <h1 className="text-white font-black text-xl tracking-tighter" style={{ color: COLORS.CUIABA_YELLOW }}>CUIABÁ</h1>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? 'bg-white/10 text-white shadow-inner font-semibold border-l-4 border-yellow-400' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 p-2">
            <UserCircle className="w-10 h-10 text-white/50" />
            <div className="overflow-hidden">
              <p className="text-white text-xs font-bold truncate">Usuário Logado</p>
              <p className="text-white/60 text-[10px] uppercase font-bold tracking-wider">{userRole.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Secretaria Municipal de Educação</h2>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-500 capitalize">{activeView.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-gray-400">STATUS DO SISTEMA</span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> OPERACIONAL
              </span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;

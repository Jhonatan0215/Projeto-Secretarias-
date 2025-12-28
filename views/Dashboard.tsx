
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { UserRole, Task, SinapiItem, TaskStatus, UrgencyLevel } from '../types';
import { COLORS } from '../constants';
import { 
  TrendingUp, Users, DollarSign, CheckCircle2, Clock, 
  GraduationCap, AlertOctagon, Landmark, Zap, Map 
} from 'lucide-react';

interface Props {
  role: UserRole;
  tasks: Task[];
  items: SinapiItem[];
}

const Dashboard: React.FC<Props> = ({ role, tasks, items }) => {
  const isSecretario = role === UserRole.SECRETARIO;
  
  // Métricas Calculadas
  const totalMedido = items.reduce((acc, i) => acc + (i.quantidadeMedidaFiscal * i.precoUnitario), 0);
  const totalContratado = items.reduce((acc, i) => acc + (i.quantidadeContratada * i.precoUnitario), 0);
  const totalTasks = tasks.length;
  const emergencies = tasks.filter(t => t.nivel === UrgencyLevel.EMERGENCIAL).length;
  
  // Métricas "Políticas" (Simuladas para o Secretário)
  const alunosImpactados = 12450;
  const escolasAtendidas = 42;
  const economiaGerada = totalContratado * 0.08; // 8% de economia teórica por fiscalização

  const chartData = [
    { name: 'Jan', investido: 4.2, meta: 4.0 },
    { name: 'Fev', investido: 3.8, meta: 4.0 },
    { name: 'Mar', investido: 5.1, meta: 4.5 },
    { name: 'Abr', investido: 4.7, meta: 4.5 },
    { name: 'Mai', investido: 6.2, meta: 5.5 },
    { name: 'Jun', investido: totalMedido / 1000000, meta: 6.0 },
  ];

  const urgencyData = [
    { name: 'Emergencial', value: tasks.filter(t => t.nivel === UrgencyLevel.EMERGENCIAL).length, color: '#EF4444' },
    { name: 'Urgência', value: tasks.filter(t => t.nivel === UrgencyLevel.URGENCIA).length, color: '#F59E0B' },
    { name: 'Preventiva', value: tasks.filter(t => t.nivel === UrgencyLevel.PREVENTIVA).length, color: '#3B82F6' },
  ];

  if (isSecretario) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Secretário */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Visão Estratégica de Governo</h1>
            <p className="text-gray-500 font-medium">Acompanhamento de impacto e execução orçamentária das obras da Educação.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orçamento Total 2024</p>
              <p className="text-xl font-black text-green-700">R$ 48.500.000,00</p>
            </div>
            <div className="p-3 bg-green-50 rounded-2xl">
              <Landmark className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* KPIs de Alto Impacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-3xl shadow-lg shadow-green-100 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><DollarSign className="w-5 h-5" /></div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">+12.5% vs 2023</span>
            </div>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Investimento Realizado</p>
            <h3 className="text-2xl font-black mt-1">R$ {(totalMedido / 1000000).toFixed(2)}M</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><GraduationCap className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Alunos Impactados</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900">{alunosImpactados.toLocaleString()}</h3>
            <p className="text-xs text-blue-600 font-bold mt-2">Em 12 distritos de Cuiabá</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertOctagon className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ações Críticas</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900">{emergencies} Atendimentos</h3>
            <p className="text-xs text-amber-600 font-bold mt-2">Resposta média: 1.8 horas</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Zap className="w-5 h-5" /></div>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Eficiência de Gestão</p>
            <h3 className="text-2xl font-black mt-1 text-gray-900">R$ {(economiaGerada / 1000).toFixed(0)}k</h3>
            <p className="text-xs text-purple-600 font-bold mt-2">Economia via auditoria SINAPI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico de Evolução Financeira */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-gray-800 text-lg">Evolução Financeira por Mês</h3>
                <p className="text-sm text-gray-400">Comparativo de investimento real vs. planejado (em Milhões)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Real</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-200 rounded-full"></span> Meta</div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="investido" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorReal)" />
                  <Area type="monotone" dataKey="meta" stroke="#E5E7EB" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição de Urgências */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-800 text-lg mb-2">Demandas Sociais</h3>
            <p className="text-sm text-gray-400 mb-8">Nível de criticidade das solicitações escolares.</p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urgencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-6">
              {urgencyData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-bold text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-green-50 rounded-2xl">
              <Map className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h4 className="font-black text-gray-800">Cuiabá em Obras</h4>
              <p className="text-sm text-gray-500">Existem atualmente {escolasAtendidas} frentes de trabalho ativas em todas as regionais de Cuiabá.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="font-black text-gray-800">Participação Popular</h4>
              <p className="text-sm text-gray-500">O índice de satisfação das diretorias escolares com a rapidez da manutenção preventiva subiu 15%.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visualização Técnica (Diretor, Fiscal, etc.)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Medido', value: `R$ ${(totalMedido/1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Obras Ativas', value: '24', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pendências OS', value: pendingTasks.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Chamados', value: totalTasks.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1 text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">Evolução de Medição Mensal</h3>
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> TEMPO REAL
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="investido" fill={COLORS.CUIABA_GREEN} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="meta" fill={COLORS.CUIABA_YELLOW} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Status de Atendimento</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></span>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const pendingTasks = 12; // Placeholder, should be derived from tasks prop in technical view
const completedTasks = 48; // Placeholder

const pieData = [
  { name: 'Concluído', value: completedTasks },
  { name: 'Em Aberto', value: pendingTasks },
];

const PIE_COLORS = [COLORS.CUIABA_GREEN, COLORS.CUIABA_YELLOW];

export default Dashboard;

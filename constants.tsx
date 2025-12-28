
import { SinapiItem, Task, UrgencyLevel, TaskStatus, GlobalContract } from './types';

export const COLORS = {
  CUIABA_GREEN: '#008443',
  CUIABA_YELLOW: '#FDC200',
  CUIABA_YELLOW_LIGHT: '#FFF1B5',
};

export const MOCK_GLOBAL_CONTRACTS: GlobalContract[] = [
  { id: '1', obra: 'EMEB Cuiabá - Reforma Geral', empresa: 'Construtora Pantanal Ltda', valorTotal: 1250000, valorMedido: 450000, progresso: 36, ultimaMedicao: '20/10/2023', status: 'EM_DIA' },
  { id: '2', obra: 'EMEB Juvina - Bloco B', empresa: 'MT Obras & Serviços', valorTotal: 890000, valorMedido: 720000, progresso: 80, ultimaMedicao: '22/10/2023', status: 'EM_DIA' },
  { id: '3', obra: 'EMEB Pantanal - Quadra', empresa: 'Várzea Grande Engenharia', valorTotal: 2100000, valorMedido: 105000, progresso: 5, ultimaMedicao: '15/10/2023', status: 'ATRASADO' },
  { id: '4', obra: 'Creche Municipal Centro', empresa: 'Cuiabá Construções', valorTotal: 500000, valorMedido: 500000, progresso: 100, ultimaMedicao: '01/09/2023', status: 'EM_DIA' },
];

export const MOCK_SINAPI: SinapiItem[] = [
  {
    codigo: '88316',
    descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES',
    unidade: 'H',
    precoUnitario: 18.45,
    quantidadeContratada: 500,
    quantidadeExecutadaEmpresa: 120,
    quantidadeMedidaFiscal: 110,
  },
  {
    codigo: '92270',
    descricao: 'FABRICAÇÃO DE FÔRMA PARA PILARES E VIGAS EM MADEIRA',
    unidade: 'M2',
    precoUnitario: 85.30,
    quantidadeContratada: 200,
    quantidadeExecutadaEmpresa: 45,
    quantidadeMedidaFiscal: 45,
  },
  {
    codigo: '94962',
    descricao: 'CONCRETO SIMPLES FCK=20MPA PREPARADO EM BETONEIRA',
    unidade: 'M3',
    precoUnitario: 420.00,
    quantidadeContratada: 50,
    quantidadeExecutadaEmpresa: 10,
    quantidadeMedidaFiscal: 8,
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    obraNome: 'EMEB Juvina',
    titulo: 'Vazamento de cano mestre',
    local: 'Cozinha Principal',
    nivel: UrgencyLevel.EMERGENCIAL,
    status: TaskStatus.EM_EXECUCAO,
    dataCriacao: '2023-10-25T14:30:00',
  },
  {
    id: '2',
    obraNome: 'EMEB Cuiabá',
    titulo: 'Queda de disjuntor',
    local: 'Bloco B',
    nivel: UrgencyLevel.URGENCIA,
    status: TaskStatus.A_FAZER,
    dataCriacao: '2023-10-25T10:00:00',
  },
  {
    id: '3',
    obraNome: 'EMEB Pantanal',
    titulo: 'Pintura de fachada',
    local: 'Entrada Principal',
    nivel: UrgencyLevel.PREVENTIVA,
    status: TaskStatus.CONCLUIDO,
    dataCriacao: '2023-10-10T08:00:00',
  },
];

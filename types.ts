
export enum UserRole {
  SECRETARIO = 'SECRETARIO',
  DIRETOR = 'DIRETOR',
  FISCAL = 'FISCAL',
  EMPRESA = 'EMPRESA',
  ORGAO_INTERNO = 'ORGAO_INTERNO'
}

export enum UrgencyLevel {
  EMERGENCIAL = 'EMERGENCIAL', // 2 hours
  URGENCIA = 'URGENCIA',     // 1 day
  PREVENTIVA = 'PREVENTIVA'   // 15 days
}

export enum TaskStatus {
  A_FAZER = 'A_FAZER',
  EM_EXECUCAO = 'EM_EXECUCAO',
  CONCLUIDO = 'CONCLUIDO'
}

export interface SinapiItem {
  codigo: string;
  descricao: string;
  unidade: string;
  precoUnitario: number;
  quantidadeContratada: number;
  quantidadeExecutadaEmpresa: number;
  quantidadeMedidaFiscal: number;
}

export interface Task {
  id: string;
  titulo: string;
  local: string;
  nivel: UrgencyLevel;
  status: TaskStatus;
  dataCriacao: string;
  obraNome: string; // Adicionado para rastreabilidade
}

export interface GlobalContract {
  id: string;
  obra: string;
  empresa: string;
  valorTotal: number;
  valorMedido: number;
  progresso: number;
  ultimaMedicao: string;
  status: 'EM_DIA' | 'ATRASADO' | 'PENDENTE';
}

export interface PhotoReport {
  id: string;
  itemCodigo: string;
  url: string;
  data: string;
  descricao: string;
}

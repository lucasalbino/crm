export const STAGES = [
  {
    id: 'prospeccao',
    label: 'Prospecção',
    badgeClass: 'bg-slate-100 text-slate-600',
    dotClass: 'bg-slate-400',
    headerClass: 'bg-slate-50 border-slate-200',
    probability: 0.1,
  },
  {
    id: 'qualificacao',
    label: 'Qualificação',
    badgeClass: 'bg-blue-100 text-blue-700',
    dotClass: 'bg-blue-400',
    headerClass: 'bg-blue-50 border-blue-200',
    probability: 0.25,
  },
  {
    id: 'proposta',
    label: 'Proposta',
    badgeClass: 'bg-amber-100 text-amber-700',
    dotClass: 'bg-amber-400',
    headerClass: 'bg-amber-50 border-amber-200',
    probability: 0.5,
  },
  {
    id: 'negociacao',
    label: 'Negociação',
    badgeClass: 'bg-orange-100 text-orange-700',
    dotClass: 'bg-orange-400',
    headerClass: 'bg-orange-50 border-orange-200',
    probability: 0.75,
  },
  {
    id: 'fechado',
    label: 'Fechado',
    badgeClass: 'bg-green-100 text-green-700',
    dotClass: 'bg-green-500',
    headerClass: 'bg-green-50 border-green-200',
    probability: 1.0,
  },
]

export const SEGMENTS = [
  'Tecnologia',
  'Saúde',
  'Varejo',
  'Educação',
  'Finanças',
  'Construção',
  'Alimentação',
  'Logística',
  'Marketing',
  'Consultoria',
  'Outros',
]

export const TASK_TYPES = [
  { id: 'call', label: 'Ligação' },
  { id: 'meeting', label: 'Reunião' },
  { id: 'email', label: 'E-mail' },
]

export const STATUS_OPTIONS = [
  { id: 'ativo', label: 'Ativo' },
  { id: 'inativo', label: 'Inativo' },
]

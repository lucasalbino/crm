import { STAGES } from '../../utils/constants'

export function StageBadge({ stage }) {
  const s = STAGES.find((x) => x.id === stage)
  if (!s) return null
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.badgeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dotClass}`} />
      {s.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const isAtivo = status === 'ativo'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${isAtivo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAtivo ? 'bg-green-500' : 'bg-slate-400'}`} />
      {isAtivo ? 'Ativo' : 'Inativo'}
    </span>
  )
}

export function TaskTypeBadge({ type }) {
  const map = {
    call: { label: 'Ligação', cls: 'bg-blue-100 text-blue-700' },
    meeting: { label: 'Reunião', cls: 'bg-purple-100 text-purple-700' },
    email: { label: 'E-mail', cls: 'bg-amber-100 text-amber-700' },
  }
  const t = map[type] || { label: type, cls: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${t.cls}`}>
      {t.label}
    </span>
  )
}

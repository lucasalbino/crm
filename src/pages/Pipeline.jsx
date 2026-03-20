import { useState, useRef } from 'react'
import { Plus, GripVertical, LayoutGrid, List, Building2, DollarSign } from 'lucide-react'
import { useStore } from '../store'
import { STAGES } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import { StageBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CompanyModal from '../components/companies/CompanyModal'

// ── Kanban Deal Card ──────────────────────────────────────────────────────────
function DealCard({ company, onEdit, isDragging }) {
  const { contacts } = useStore()
  const compContacts = contacts.filter((c) => c.companyId === company.id)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('companyId', company.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className={`card p-3.5 cursor-grab active:cursor-grabbing select-none
                  transition-all duration-200
                  hover:shadow-card-hover hover:-translate-y-0.5
                  ${isDragging ? 'opacity-50 scale-95 rotate-1' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-tight">
          {company.name}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(company) }}
          className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <GripVertical size={12} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{company.segment}</span>
        <span className="text-xs font-bold text-primary">{formatCurrency(company.value)}</span>
      </div>

      {compContacts.length > 0 && (
        <div className="flex items-center gap-1 mt-2.5 pt-2.5 border-t border-border dark:border-border-dark">
          <div className="flex -space-x-1">
            {compContacts.slice(0, 3).map((ct) => (
              <div
                key={ct.id}
                title={ct.name}
                className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-[#161B22] flex items-center justify-center text-white text-[8px] font-bold"
              >
                {ct.name[0]}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 ml-1">
            {compContacts.length} contato{compContacts.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Kanban Column ─────────────────────────────────────────────────────────────
function KanbanColumn({ stage, companies, onEdit, dragOver, onDragOver, onDrop, onDragLeave }) {
  const total = companies.reduce((s, c) => s + (c.value || 0), 0)
  const [draggingId, setDraggingId] = useState(null)

  return (
    <div className="flex flex-col w-64 shrink-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 border ${stage.headerClass} dark:bg-slate-800/50 dark:border-border-dark`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stage.label}</span>
          <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-border dark:border-border-dark">
            {companies.length}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className={`kanban-column flex-1 ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); onDragOver(stage.id) }}
        onDrop={(e) => { e.preventDefault(); onDrop(stage.id, e.dataTransfer.getData('companyId')) }}
        onDragLeave={onDragLeave}
      >
        {companies.map((c) => (
          <DealCard
            key={c.id}
            company={c}
            onEdit={onEdit}
            isDragging={draggingId === c.id}
          />
        ))}

        {companies.length === 0 && !dragOver && (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-300 dark:text-slate-600">Arraste para cá</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── List View ─────────────────────────────────────────────────────────────────
function ListView({ companies, onEdit }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Empresa</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Etapa</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Valor</th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">Segmento</th>
            <th className="py-3 px-4" />
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary/20 flex items-center justify-center">
                    <Building2 size={13} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A] dark:text-white">{c.name}</span>
                </div>
              </td>
              <td className="py-3.5 px-4"><StageBadge stage={c.stage} /></td>
              <td className="py-3.5 px-4 text-sm font-semibold text-[#0F172A] dark:text-white">
                {formatCurrency(c.value)}
              </td>
              <td className="py-3.5 px-4 text-xs text-slate-400 hidden md:table-cell">{c.segment}</td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => onEdit(c)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main Pipeline ─────────────────────────────────────────────────────────────
export default function Pipeline() {
  const { companies, moveCompanyStage } = useStore()
  const [view, setView] = useState('kanban')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCompany, setEditCompany] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)

  const activeCompanies = companies.filter((c) => c.status === 'ativo')
  const totalPipeline = activeCompanies.reduce((s, c) => s + (c.value || 0), 0)

  // Weighted forecast
  const forecast = activeCompanies.reduce((s, c) => {
    const stage = STAGES.find((x) => x.id === c.stage)
    return s + (c.value || 0) * (stage?.probability ?? 0)
  }, 0)

  const handleDrop = (stageId, companyId) => {
    if (companyId) moveCompanyStage(companyId, stageId)
    setDragOverStage(null)
  }

  const handleEdit = (c) => { setEditCompany(c); setModalOpen(true) }
  const handleNew = () => { setEditCompany(null); setModalOpen(true) }

  return (
    <div className="space-y-4">
      {/* Forecast strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Total pipeline</p>
          <p className="text-xl font-bold text-[#0F172A] dark:text-white">{formatCurrency(totalPipeline)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Forecast</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(forecast)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Oportunidades</p>
          <p className="text-xl font-bold text-[#0F172A] dark:text-white">{activeCompanies.length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#161B22] rounded-xl border border-border dark:border-border-dark">
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${view === 'kanban' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <LayoutGrid size={13} /> Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${view === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <List size={13} /> Lista
          </button>
        </div>

        <Button onClick={handleNew} size="sm">
          <Plus size={14} /> Nova empresa
        </Button>
      </div>

      {/* Views */}
      {view === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                companies={activeCompanies.filter((c) => c.stage === stage.id)}
                onEdit={handleEdit}
                dragOver={dragOverStage === stage.id}
                onDragOver={setDragOverStage}
                onDrop={handleDrop}
                onDragLeave={() => setDragOverStage(null)}
              />
            ))}
          </div>
        </div>
      ) : (
        <ListView companies={activeCompanies} onEdit={handleEdit} />
      )}

      <CompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        company={editCompany}
      />
    </div>
  )
}

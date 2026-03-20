import { useState, useMemo } from 'react'
import { Plus, Search, Building2, Users, Trash2, Pencil, ChevronDown, Phone, Mail } from 'lucide-react'
import { useStore } from '../store'
import { STAGES } from '../utils/constants'
import { formatCurrency, formatDate } from '../utils/formatters'
import { StageBadge, StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import CompanyModal from '../components/companies/CompanyModal'
import ContactModal from '../components/contacts/ContactModal'
import TaskModal from '../components/tasks/TaskModal'
import Modal from '../components/ui/Modal'

function CompanyRow({ company, onEdit, onDelete, onAddContact }) {
  const { contacts, tasks } = useStore()
  const [expanded, setExpanded] = useState(false)
  const compContacts = contacts.filter((c) => c.companyId === company.id)
  const compTasks = tasks.filter((t) => t.companyId === company.id && t.status === 'pending')

  return (
    <>
      <tr
        className="border-b border-border dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary/20 flex items-center justify-center shrink-0">
              <Building2 size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{company.name}</p>
              <p className="text-xs text-slate-400">{company.segment}</p>
            </div>
          </div>
        </td>
        <td className="py-3.5 px-4 hidden md:table-cell">
          <StageBadge stage={company.stage} />
        </td>
        <td className="py-3.5 px-4 hidden sm:table-cell">
          <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
            {formatCurrency(company.value)}
          </span>
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Users size={13} />
            {compContacts.length} contatos
          </div>
        </td>
        <td className="py-3.5 px-4 hidden lg:table-cell">
          <StatusBadge status={company.status} />
        </td>
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(company) }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(company) }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={14} />
            </button>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ml-1 ${expanded ? 'rotate-180' : ''}`}
            />
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-50 dark:bg-slate-800/30">
          <td colSpan={6} className="px-4 py-3">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Contatos ({compContacts.length})
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddContact(company) }}
                    className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Adicionar
                  </button>
                </div>
                {compContacts.length === 0 ? (
                  <p className="text-xs text-slate-400">Nenhum contato vinculado</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {compContacts.map((ct) => (
                      <div key={ct.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-3 py-2 border border-border dark:border-border-dark">
                        <div className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {ct.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#0F172A] dark:text-white">{ct.name}</p>
                          <p className="text-[10px] text-slate-400">{ct.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {compTasks.length > 0 && (
                <div className="w-48">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Tarefas pendentes
                  </p>
                  <div className="space-y-1">
                    {compTasks.slice(0, 3).map((t) => (
                      <p key={t.id} className="text-xs text-slate-600 dark:text-slate-300 truncate">
                        · {t.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function Companies() {
  const { companies, deleteCompany } = useStore()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCompany, setEditCompany] = useState(null)
  const [contactModal, setContactModal] = useState({ open: false, companyId: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return companies.filter((c) => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q)
      const matchStage = !stageFilter || c.stage === stageFilter
      return matchSearch && matchStage
    })
  }, [companies, search, stageFilter])

  const handleEdit = (c) => { setEditCompany(c); setModalOpen(true) }
  const handleNew = () => { setEditCompany(null); setModalOpen(true) }
  const handleDelete = (c) => setDeleteConfirm(c)
  const confirmDelete = () => { deleteCompany(deleteConfirm.id); setDeleteConfirm(null) }

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-9"
            placeholder="Buscar empresas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-base w-full sm:w-44"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="">Todas as etapas</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        <Button onClick={handleNew}>
          <Plus size={15} /> Nova empresa
        </Button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Empresa</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:table-cell">Etapa</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Valor</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">Contatos</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:table-cell">Status</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Building2 size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nenhuma empresa encontrada</p>
                  <button onClick={handleNew} className="mt-2 text-xs text-primary hover:underline font-semibold">
                    Criar nova empresa
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <CompanyRow
                  key={c.id}
                  company={c}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddContact={(company) => setContactModal({ open: true, companyId: company.id })}
                />
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border dark:border-border-dark bg-slate-50 dark:bg-slate-800/30">
            <p className="text-xs text-slate-400">
              {filtered.length} empresa{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <CompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        company={editCompany}
      />

      <ContactModal
        open={contactModal.open}
        onClose={() => setContactModal({ open: false, companyId: '' })}
        defaultCompanyId={contactModal.companyId}
      />

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Excluir empresa" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Tem certeza que deseja excluir <strong>{deleteConfirm?.name}</strong>?
          Esta ação removerá também os contatos e tarefas vinculados.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Plus, Search, Users, Mail, Phone, Pencil, Trash2, Building2 } from 'lucide-react'
import { useStore } from '../store'
import Button from '../components/ui/Button'
import ContactModal from '../components/contacts/ContactModal'
import Modal from '../components/ui/Modal'

function ContactCard({ contact, onEdit, onDelete }) {
  const { companies } = useStore()
  const company = companies.find((c) => c.id === contact.companyId)

  return (
    <div className="card p-4 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {contact.name[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{contact.name}</p>
            {contact.role && (
              <p className="text-xs text-slate-400">{contact.role}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(contact)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary-50 dark:hover:bg-primary/10 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        {contact.email && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Phone size={12} className="shrink-0" />
            <span>{contact.phone}</span>
          </div>
        )}
        {company && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Building2 size={12} className="shrink-0" />
            <span className="truncate">{company.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Contacts() {
  const { contacts, deleteContact, companies } = useStore()
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editContact, setEditContact] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return contacts.filter((c) => {
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q)
      const matchCompany = !companyFilter || c.companyId === companyFilter
      return matchSearch && matchCompany
    })
  }, [contacts, search, companyFilter])

  const handleEdit = (c) => { setEditContact(c); setModalOpen(true) }
  const handleNew = () => { setEditContact(null); setModalOpen(true) }
  const confirmDelete = () => { deleteContact(deleteConfirm.id); setDeleteConfirm(null) }

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-base pl-9"
            placeholder="Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-base w-full sm:w-52"
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="">Todas as empresas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <Button onClick={handleNew}>
          <Plus size={15} /> Novo contato
        </Button>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400">
        {filtered.length} contato{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card py-20 text-center">
          <Users size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Nenhum contato encontrado</p>
          <button onClick={handleNew} className="mt-2 text-xs text-primary hover:underline font-semibold">
            Criar novo contato
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              onEdit={handleEdit}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contact={editContact}
      />

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Excluir contato" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Tem certeza que deseja excluir <strong>{deleteConfirm?.name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
        </div>
      </Modal>
    </div>
  )
}

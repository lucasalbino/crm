import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Input, Select } from '../ui/Input'
import Button from '../ui/Button'
import { useStore } from '../../store'

const empty = { name: '', email: '', phone: '', role: '', companyId: '' }

export default function ContactModal({ open, onClose, contact = null, defaultCompanyId = '' }) {
  const { addContact, updateContact, companies } = useStore()
  const [form, setForm] = useState({ ...empty, companyId: defaultCompanyId })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (contact) {
      setForm({ ...contact })
    } else {
      setForm({ ...empty, companyId: defaultCompanyId })
    }
    setErrors({})
  }, [contact, open, defaultCompanyId])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (!form.companyId) e.companyId = 'Selecione uma empresa'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    if (contact) {
      updateContact(contact.id, form)
    } else {
      addContact(form)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={contact ? 'Editar Contato' : 'Novo Contato'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Ex: Ana Lima"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="email@empresa.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cargo"
            placeholder="Ex: CEO"
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
          />
          <Select
            label="Empresa"
            value={form.companyId}
            onChange={(e) => set('companyId', e.target.value)}
            error={errors.companyId}
          >
            <option value="">Selecione...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {contact ? 'Salvar alterações' : 'Criar contato'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

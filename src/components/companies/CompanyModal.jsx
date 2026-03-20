import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Input, Select } from '../ui/Input'
import Button from '../ui/Button'
import { useStore } from '../../store'
import { STAGES, SEGMENTS, STATUS_OPTIONS } from '../../utils/constants'

const empty = { name: '', segment: 'Tecnologia', value: '', stage: 'prospeccao', status: 'ativo' }

export default function CompanyModal({ open, onClose, company = null }) {
  const { addCompany, updateCompany } = useStore()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company) {
      setForm({ ...company, value: String(company.value) })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [company, open])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (!form.value || isNaN(Number(form.value))) e.value = 'Valor inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, value: Number(form.value) }
    if (company) {
      updateCompany(company.id, data)
    } else {
      addCompany(data)
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={company ? 'Editar Empresa' : 'Nova Empresa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da empresa"
          placeholder="Ex: TechFlow Solutions"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Segmento"
            value={form.segment}
            onChange={(e) => set('segment', e.target.value)}
          >
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>

          <Input
            label="Valor potencial (R$)"
            type="number"
            placeholder="0"
            min="0"
            value={form.value}
            onChange={(e) => set('value', e.target.value)}
            error={errors.value}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Etapa"
            value={form.stage}
            onChange={(e) => set('stage', e.target.value)}
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {company ? 'Salvar alterações' : 'Criar empresa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

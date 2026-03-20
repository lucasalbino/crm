import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Input, Select } from '../ui/Input'
import Button from '../ui/Button'
import { useStore } from '../../store'
import { TASK_TYPES } from '../../utils/constants'
import { todayISO } from '../../utils/formatters'

const empty = { title: '', type: 'call', dueDate: todayISO(), companyId: '' }

export default function TaskModal({ open, onClose, task = null, defaultCompanyId = '' }) {
  const { addTask, updateTask, companies } = useStore()
  const [form, setForm] = useState({ ...empty, companyId: defaultCompanyId })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({ ...task })
    } else {
      setForm({ ...empty, companyId: defaultCompanyId, dueDate: todayISO() })
    }
    setErrors({})
  }, [task, open, defaultCompanyId])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Título obrigatório'
    if (!form.dueDate) e.dueDate = 'Data obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    if (task) {
      updateTask(task.id, form)
    } else {
      addTask({ ...form, status: 'pending' })
    }
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Editar Tarefa' : 'Nova Tarefa'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título"
          placeholder="Ex: Ligar para cliente"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          error={errors.title}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo"
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
          >
            {TASK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </Select>

          <Input
            label="Data"
            type="date"
            value={form.dueDate}
            onChange={(e) => set('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <Select
          label="Empresa (opcional)"
          value={form.companyId}
          onChange={(e) => set('companyId', e.target.value)}
        >
          <option value="">Nenhuma empresa</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {task ? 'Salvar alterações' : 'Criar tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

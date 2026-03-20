import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayISO, tomorrowISO } from '../utils/formatters'

const uid = () => crypto.randomUUID()

const sampleCompanies = [
  {
    id: 'c1',
    name: 'TechFlow Solutions',
    segment: 'Tecnologia',
    value: 45000,
    stage: 'proposta',
    status: 'ativo',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'c2',
    name: 'Saúde Plus',
    segment: 'Saúde',
    value: 32000,
    stage: 'negociacao',
    status: 'ativo',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'c3',
    name: 'Mercado Agro',
    segment: 'Varejo',
    value: 18500,
    stage: 'qualificacao',
    status: 'ativo',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'c4',
    name: 'EduStart',
    segment: 'Educação',
    value: 28000,
    stage: 'prospeccao',
    status: 'ativo',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'c5',
    name: 'FinanceX',
    segment: 'Finanças',
    value: 75000,
    stage: 'fechado',
    status: 'ativo',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'c6',
    name: 'Construmax',
    segment: 'Construção',
    value: 22000,
    stage: 'prospeccao',
    status: 'ativo',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
]

const sampleContacts = [
  {
    id: 'ct1',
    name: 'Ana Lima',
    email: 'ana.lima@techflow.com.br',
    phone: '(11) 99876-5432',
    role: 'CEO',
    companyId: 'c1',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'ct2',
    name: 'Pedro Costa',
    email: 'pedro@techflow.com.br',
    phone: '(11) 98765-4321',
    role: 'CTO',
    companyId: 'c1',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'ct3',
    name: 'Maria Santos',
    email: 'maria@saudeplus.com.br',
    phone: '(21) 97654-3210',
    role: 'Diretora Comercial',
    companyId: 'c2',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'ct4',
    name: 'João Oliveira',
    email: 'joao@mercadoagro.com.br',
    phone: '(51) 96543-2109',
    role: 'Gerente de TI',
    companyId: 'c3',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'ct5',
    name: 'Carla Mendes',
    email: 'carla@edustart.com.br',
    phone: '(31) 95432-1098',
    role: 'Fundadora',
    companyId: 'c4',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
]

const sampleTasks = [
  {
    id: 't1',
    title: 'Ligar para Ana Lima sobre proposta',
    type: 'call',
    dueDate: todayISO(),
    status: 'pending',
    companyId: 'c1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Reunião de alinhamento com Saúde Plus',
    type: 'meeting',
    dueDate: tomorrowISO(),
    status: 'pending',
    companyId: 'c2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Enviar proposta revisada para EduStart',
    type: 'email',
    dueDate: todayISO(),
    status: 'pending',
    companyId: 'c4',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Follow-up pós-reunião Mercado Agro',
    type: 'email',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'pending',
    companyId: 'c3',
    createdAt: new Date().toISOString(),
  },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Dark mode ────────────────────────────────────────────
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        if (next) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // ─── Companies ────────────────────────────────────────────
      companies: sampleCompanies,

      addCompany: (data) =>
        set((s) => ({
          companies: [
            { ...data, id: uid(), createdAt: new Date().toISOString() },
            ...s.companies,
          ],
        })),

      updateCompany: (id, data) =>
        set((s) => ({
          companies: s.companies.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCompany: (id) =>
        set((s) => ({
          companies: s.companies.filter((c) => c.id !== id),
          contacts: s.contacts.filter((ct) => ct.companyId !== id),
          tasks: s.tasks.filter((t) => t.companyId !== id),
        })),

      moveCompanyStage: (id, stage) =>
        set((s) => ({
          companies: s.companies.map((c) => (c.id === id ? { ...c, stage } : c)),
        })),

      // ─── Contacts ─────────────────────────────────────────────
      contacts: sampleContacts,

      addContact: (data) =>
        set((s) => ({
          contacts: [
            { ...data, id: uid(), createdAt: new Date().toISOString() },
            ...s.contacts,
          ],
        })),

      updateContact: (id, data) =>
        set((s) => ({
          contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteContact: (id) =>
        set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),

      // ─── Tasks ────────────────────────────────────────────────
      tasks: sampleTasks,

      addTask: (data) =>
        set((s) => ({
          tasks: [
            { ...data, id: uid(), createdAt: new Date().toISOString() },
            ...s.tasks,
          ],
        })),

      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
              : t
          ),
        })),
    }),
    {
      name: 'crm-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    }
  )
)

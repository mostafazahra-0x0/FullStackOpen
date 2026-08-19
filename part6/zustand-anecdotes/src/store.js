import { create } from 'zustand'
import anecdoteService from './services/anecdotes'
import useNotificationStore from './notificationStore'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set((state) => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updated : a)
      }))
      useNotificationStore.getState().actions.showNotification(
        `you voted '${updated.content}'`
      )
    },
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({
        anecdotes: [...state.anecdotes, newAnecdote],
      }))
      useNotificationStore.getState().actions.showNotification(
        `you created '${newAnecdote.content}'`
      )
    },
    remove: async (id) => {
      await anecdoteService.remove(id)
      set((state) => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (value) => set(() => ({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
  },
}))

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
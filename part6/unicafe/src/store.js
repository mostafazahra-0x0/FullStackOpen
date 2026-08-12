import { create } from 'zustand'

export const useStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    setGood: () => set(state => ({ good: state.good + 1 })),
    setNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    setBad: () => set(state => ({ bad: state.bad + 1 })),
  }
}))

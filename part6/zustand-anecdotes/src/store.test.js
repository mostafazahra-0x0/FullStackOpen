import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'
const anecdotes = [
  { content: 'first anecdote', id: 1, votes: 0 },
  { content: 'second anecdote', id: 2, votes: 0 }
]

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteStore', () => {
  it('initializes store with anecdotes from the service', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotes)
    const { result } = renderHook(() => useAnecdoteStore())
    await act(async () => {
      await result.current.initialize()
    })
    expect(result.current.anecdotes).toEqual(anecdotes)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, render } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import {
  useAnecdoteStore,
  useAnecdotes,
  useFilter,
  useAnecdoteActions
} from './store'
import AnecdoteList from './components/AnecdoteList'
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
    const { result: actions } = renderHook(() => useAnecdoteActions())
    const { result: state } = renderHook(() => useAnecdotes())
    await act(async () => {
      await actions.current.initialize()
    })
    expect(state.current).toEqual(anecdotes)
  })
  it('renders anecdotes from the store in vote order', () => {
    const anecdotes = [
      { content: 'A', id: 1, votes: 2 },
      { content: 'B', id: 2, votes: 5 },
      { content: 'C', id: 3, votes: 1 }
    ]
    useAnecdoteStore.setState({
      anecdotes: anecdotes,
      filter: ''
    })
    const { getByText } = render(<AnecdoteList />)
    const b = getByText('B')
    const a = getByText('A')
    const c = getByText('C')
    expect(
      b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      a.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, render, cleanup } from '@testing-library/react'
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
      b.compareDocumentPosition(a)
      & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      a.compareDocumentPosition(c)
      & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
  it('renders only anecdotes matching the filter', () => {
    const anecdotes = [
      { content: 'JavaScript is soo hard', id: 1, votes: 2 },
      { content: 'React is great', id: 2, votes: 5 },
      { content: 'I do not like testing', id: 3, votes: 1 }
    ]
    useAnecdoteStore.setState({
      anecdotes,
      filter: 'no'
    })
    const { getAllByText, queryByText } = render(<AnecdoteList />)
    expect(getAllByText('I do not like testing')).toHaveLength(1)
    expect(queryByText('React is great')).toBeNull()
    expect(queryByText('JavaScript is soo hard')).toBeNull()
  })
  it('voting increases the number of votes for an anecdote', async () => {
    const anecdote = {
      content: 'JavaScript is soo hard',
      id: 1,
      votes: 2
    }
    anecdoteService.update.mockResolvedValue({
      ...anecdote,
      votes: 3
    })
    useAnecdoteStore.setState({
      anecdotes: [anecdote],
      filter: ''
    })
    const { getByText } = render(<AnecdoteList />)
    const button = getByText('vote')
    await act(async () => {
      button.click()
    })
    expect(
      useAnecdoteStore.getState().anecdotes[0].votes
    ).toBe(3)
  })
})
afterEach(() => {
  cleanup()
})
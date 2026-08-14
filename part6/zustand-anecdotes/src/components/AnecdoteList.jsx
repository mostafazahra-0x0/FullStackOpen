import { useAnecdotes, useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)
  return (
    <div>
      <ul>
        {sortedAnecdotes.map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
              {anecdote.votes === 0 &&
                <button onClick={() => remove(anecdote.id)}>remove</button>
              }
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}
export default AnecdoteList
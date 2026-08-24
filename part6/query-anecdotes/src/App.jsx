import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const queryClient = useQueryClient()

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available</div>
  }

  const voteAnecdote = (id) => {
    const updatedAnecdote = result.data.find(
      (anecdote) => anecdote.id === id
    )

    if (updatedAnecdote) {
      const updatedVotes = updatedAnecdote.votes + 1

      const updatedAnecdoteWithVotes = {
        ...updatedAnecdote,
        votes: updatedVotes
      }

      voteMutation.mutate(updatedAnecdoteWithVotes)
    }
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />

      {result.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote.id)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
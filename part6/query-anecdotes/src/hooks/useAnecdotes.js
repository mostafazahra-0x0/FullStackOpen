import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from '../requests'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const addAnecdote = (content) => {
    newAnecdoteMutation.mutate({ content })
  }

  const voteAnecdote = (id) => {
    const anecdote = result.data.find(
      anecdote => anecdote.id === id
    )

    if (anecdote) {
      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      voteMutation.mutate(updatedAnecdote)
    }
  }

  return {
    anecdotes: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    addAnecdote,
    voteAnecdote
  }
}
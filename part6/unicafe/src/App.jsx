import { useStore } from './store'
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average.toFixed(1)} />
          <StatisticLine text="positive" value={`${positive.toFixed(1)} %`} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const { good, neutral, bad, actions } = useStore()

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={actions.setGood} text="good" />
      <Button onClick={actions.setNeutral} text="neutral" />
      <Button onClick={actions.setBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
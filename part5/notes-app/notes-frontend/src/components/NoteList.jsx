import Note from './Note'
import { Link } from 'react-router-dom'

const NoteList = ({ notes, showAll, setShowAll, toggleImportanceOf }) => {
  return (
    <div>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NoteList
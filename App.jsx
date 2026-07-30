import { useState } from 'react'

function App() {
  const [ideas, setIdeas] = useState([])
  const [text, setText] = useState('')

  const addIdea = (e) => {
    e.preventDefault()
    if (text.trim() === '') return
    setIdeas([{ id: Date.now(), content: text }, ...ideas])
    setText('')
  }

  const deleteIdea = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id))
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>💡 IdeaFlow</h1>
      <p>Ứng dụng demo giao diện Web tĩnh, host trên <b>Azure Static Web Apps</b>.</p>

      <form onSubmit={addIdea} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập ý tưởng mới..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Thêm
        </button>
      </form>

      {ideas.length === 0 ? (
        <i>Chưa có ý tưởng nào.</i>
      ) : (
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id} style={{ margin: '8px 0' }}>
              {idea.content}{' '}
              <a href="#" onClick={() => deleteIdea(idea.id)} style={{ color: 'red' }}>
                [Xóa]
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [ideas, setIdeas] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  // Lấy danh sách ý tưởng từ Supabase khi mở trang
  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Lỗi khi lấy dữ liệu:', error)
    } else {
      setIdeas(data)
    }
    setLoading(false)
  }

  const addIdea = async (e) => {
    e.preventDefault()
    if (text.trim() === '') return

    const { error } = await supabase
      .from('ideas')
      .insert([{ content: text }])

    if (error) {
      console.error('Lỗi khi thêm:', error)
    } else {
      setText('')
      fetchIdeas()
    }
  }

  const deleteIdea = async (id) => {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Lỗi khi xóa:', error)
    } else {
      fetchIdeas()
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>💡 IdeaFlow</h1>
      <p>Ứng dụng demo giao diện Web, kết nối <b>Supabase</b>, host trên <b>Vercel</b>.</p>
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
      {loading ? (
        <i>Đang tải...</i>
      ) : ideas.length === 0 ? (
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

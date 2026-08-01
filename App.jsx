import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const COLORS = { blue: '#3b82f6', green: '#22c55e', red: '#ef4444', yellow: '#eab308' }

function App() {
  const [ideas, setIdeas] = useState([])
  const [text, setText] = useState('')
  const [reminder, setReminder] = useState('')
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchIdeas()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders()
    }, 5000) // kiểm tra mỗi 5 giây cho dễ demo
    return () => clearInterval(interval)
  }, [ideas])

  const checkReminders = () => {
    const now = new Date()
    ideas.forEach((idea) => {
      if (idea.reminder_time && !idea.notified) {
        const remindAt = new Date(idea.reminder_time)
        if (remindAt <= now) {
          idea.notified = true
          setAlerts((prev) => [...prev, { id: idea.id, content: idea.content }])
        }
      }
    })
  }

  const closeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const fetchIdeas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Lỗi khi lấy dữ liệu:', error)
    else setIdeas(data)
    setLoading(false)
  }

  const addIdea = async (e) => {
    e.preventDefault()
    if (text.trim() === '') return
    const { error } = await supabase.from('ideas').insert([{
      content: text,
      reminder_time: reminder ? new Date(reminder).toISOString() : null,
    }])
    if (error) console.error('Lỗi khi thêm:', error)
    else {
      setText('')
      setReminder('')
      fetchIdeas()
    }
  }

  const deleteIdea = async (id) => {
    const { error } = await supabase.from('ideas').delete().eq('id', id)
    if (error) console.error('Lỗi khi xóa:', error)
    else fetchIdeas()
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif', position: 'relative' }}>

      {/* Banner thông báo nổi ở góc màn hình */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999 }}>
        {alerts.map((a) => (
          <div key={a.id} style={{
            background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 8,
            padding: '12px 16px', marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 250,
          }}>
            <b>⏰ Nhắc nhở IdeaFlow</b>
            <p style={{ margin: '4px 0' }}>{a.content}</p>
            <button onClick={() => closeAlert(a.id)} style={{ fontSize: 12 }}>Đóng</button>
          </div>
        ))}
      </div>

      <h1>💡 IdeaFlow</h1>
      <p>Ứng dụng demo giao diện Web, kết nối <b>Supabase</b>, host trên <b>Vercel</b>.</p>

      <form onSubmit={addIdea} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập ý tưởng mới..."
          style={{ flex: 1, padding: 8, minWidth: 200 }}
        />
        <input
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          style={{ padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Thêm</button>
      </form>

      {loading ? (
        <i>Đang tải...</i>
      ) : ideas.length === 0 ? (
        <i>Chưa có ý tưởng nào.</i>
      ) : (
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id} style={{ margin: '8px 0' }}>
              <span style={{ color: COLORS[idea.color] || '#000' }}>●</span>{' '}
              {idea.content} <i>({idea.status})</i>
              {idea.reminder_time && (
                <span style={{ color: '#888', fontSize: 13 }}>
                  {' '}⏰ {new Date(idea.reminder_time).toLocaleString('vi-VN')}
                </span>
              )}{' '}
              <a href="#" onClick={() => deleteIdea(idea.id)} style={{ color: 'red' }}>[Xóa]</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App

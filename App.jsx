import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'

const COLORS = { blue: '#3b82f6', green: '#22c55e', red: '#ef4444', yellow: '#eab308' }

function App() {
  const [tab, setTab] = useState('home') // 'home' hoặc 'analytics'
  const [ideas, setIdeas] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIdeas()
  }, [])

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
    const { error } = await supabase.from('ideas').insert([{ content: text }])
    if (error) console.error('Lỗi khi thêm:', error)
    else {
      setText('')
      fetchIdeas()
    }
  }

  const deleteIdea = async (id) => {
    const { error } = await supabase.from('ideas').delete().eq('id', id)
    if (error) console.error('Lỗi khi xóa:', error)
    else fetchIdeas()
  }

  // Chuẩn bị dữ liệu cho biểu đồ tròn (theo màu)
  const colorData = Object.entries(
    ideas.reduce((acc, idea) => {
      const c = idea.color || 'blue'
      acc[c] = (acc[c] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Chuẩn bị dữ liệu cho biểu đồ cột (theo trạng thái)
  const statusData = Object.entries(
    ideas.reduce((acc, idea) => {
      const s = idea.status || 'todo'
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>💡 IdeaFlow</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('home')} style={{ fontWeight: tab === 'home' ? 'bold' : 'normal', padding: '8px 16px' }}>
          Trang chủ
        </button>
        <button onClick={() => setTab('analytics')} style={{ fontWeight: tab === 'analytics' ? 'bold' : 'normal', padding: '8px 16px' }}>
          Thống kê / Analytics
        </button>
      </div>

      {tab === 'home' && (
        <>
          <p>Ứng dụng demo giao diện Web, kết nối <b>Supabase</b>, host trên <b>Vercel</b>.</p>
          <form onSubmit={addIdea} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập ý tưởng mới..."
              style={{ flex: 1, padding: 8 }}
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
                  {idea.content} <i>({idea.status})</i>{' '}
                  <a href="#" onClick={() => deleteIdea(idea.id)} style={{ color: 'red' }}>[Xóa]</a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'analytics' && (
        <div>
          <h2>Thống kê ý tưởng theo màu sắc</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={colorData} dataKey="value" nameKey="name" outerRadius={100} label>
                {colorData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name] || '#999'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <h2>Thống kê ý tưởng theo trạng thái</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default App

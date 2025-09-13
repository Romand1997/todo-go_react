import { useState, useEffect } from 'react'
import { GetTasks, AddTask, DeleteTask, ToggleTask, UpdateTask } from '../wailsjs/go/main/App'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const today = () => new Date().toISOString().slice(0,10)
  const [newDeadline, setNewDeadline] = useState(today)
  const [newErrors, setNewErrors] = useState({ title: '', deadline: '' })
  const [editDeadline, setEditDeadline] = useState('')
  const [sortMode, setSortMode] = useState('deadline')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

 
  const applyFiltersAndSort = () => {
    const today = new Date()
    const oneWeekLater = new Date()
    oneWeekLater.setDate(today.getDate() + 7)

    return [...tasks]
      .filter(t => {
        // фильтр по статусу
        if (statusFilter === 'completed' && !t.Completed) return false
        if (statusFilter === 'active' && t.Completed) return false

        // фильтр по дате
        if (dateFilter === 'today') {
          return t.Deadline?.slice(0, 10) === today.toISOString().slice(0, 10)
        }
        if (dateFilter === 'week') {
          if (!t.Deadline) return false
          const d = new Date(t.Deadline)
          d.setHours(23,59,59,999)
          return d >= today && d <= oneWeekLater
        }
        if (dateFilter === 'overdue') {
          return !t.Completed && isExpired(t.Deadline)
        }
        return true
      })
      .sort((a, b) => {
        if (sortMode === 'deadline') {
          if (a.Completed !== b.Completed) return a.Completed ? 1 : -1
          if (a.Deadline && b.Deadline) return new Date(a.Deadline) - new Date(b.Deadline)
          if (a.Deadline) return -1
          if (b.Deadline) return 1
          return 0
        }
        if (sortMode === 'title') {
          return a.Title.localeCompare(b.Title)
        }
        if (sortMode === 'status') {
          return a.Completed === b.Completed ? 0 : a.Completed ? 1 : -1
        }
        return 0
      })
  }

  const loadTasks = () => {
    GetTasks().then(data => {
    console.log('Получены задачи:', data)
    setTasks(data || [])
  })   
  }
 
  const addTask = () => {
  if (!newTask.trim()) {
    alert('Введите название задачи')
    return
  }
  if (!newDeadline) {
      alert('Выберите дату дедлайна')
      return
    }
  AddTask(newTask, newDeadline).then(() => {
    setNewTask('')
    setNewDeadline(today)
    loadTasks()
  })
}

  const handleUpdate = (id) => {
  if (!editTitle.trim() || !editDeadline) return
  UpdateTask(id, editTitle, editDeadline).then(() => {
    setEditId(null)
    setEditTitle('')
    setEditDeadline('')
    loadTasks()
  })
}

  const deleteTask = (id) => {
    DeleteTask(id).then(loadTasks)
  }

  const toggleTask = (id) => {
    ToggleTask(id).then(loadTasks)
  }

  // Пересортировка при смене режима
  // useEffect(() => {
  //   setTasks(prev => sortTasks(prev, sortMode))
  // }, [sortMode])
  // Автозагрузка задач при старте
  useEffect(() => {
    loadTasks()
  }, [])

  const isExpired = (date) => {
    if (!date) return false
    const today = new Date().toISOString().slice(0,10)
    return date < today
  }

  

  return (
    <div>
      <h1>To-Do</h1>

      <div>
        <label>Сортировка: </label>
        <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
          <option value="deadline">По дедлайну</option>
          <option value="title">По названию</option>
          <option value="status">По статусу</option>
        </select>

        <label style={{ marginLeft: '10px' }}>Статус: </label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="active">Невыполненные</option>
          <option value="completed">Выполненные</option>
        </select>

        <label style={{ marginLeft: '10px' }}>Дата: </label>
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="today">Сегодня</option>
          <option value="week">На неделю</option>
          <option value="overdue">Просроченные</option>
        </select>
      </div>



      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Введите задачу"
      />
      <input
        type="date"
        value={newDeadline}
        onChange={e => setNewDeadline(e.target.value)}
      />
      <button onClick={addTask}>Добавить</button>

        {applyFiltersAndSort().length > 0 ? (
          <ul>
            {applyFiltersAndSort().map((t) => (
            <li key={t.ID}
            style={{ color: isExpired(t.Deadline) && !t.Completed ? 'red' : 'inherit' }}
            >
              {editId === t.ID ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input  
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
                <button onClick={() => handleUpdate(t.ID)}>💾</button>
              </>
            ) : (
              <>
                <span
                onDoubleClick={() => { 
                  setEditId(t.ID); 
                  setEditTitle(t.Title);
                  setEditDeadline(t.Deadline?.slice(0, 10) || '')
                 }}
                  style={{
                    textDecoration: t.Completed ? 'line-through' : 'none',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
              >
                {t.Title}
              </span>
              <em> до {t.Deadline?.slice(0, 10) || '—'}</em>
              </>
            )}
            <span 
            onDoubleClick={() => toggleTask(t.ID)}
            style={{ marginRight: '10px',
              cursor: 'pointer'
             }}>
                {t.Completed ? '✅' : '❌'}
              </span>
              <button onClick={() => deleteTask(t.ID)}>Удалить</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Пока нет задач</p>
      )}
    </div>
  )
}

export default App

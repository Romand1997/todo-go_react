import { useState, useEffect } from 'react'
import { GetTasks, AddTask, DeleteTask, ToggleTask } from '../wailsjs/go/main/App'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])

  const loadTasks = () => {
    GetTasks().then(data => {
    console.log('Получены задачи:', data)
    setTasks(data || [])
  })   
  }

  const addTask = () => {
    if (!newTask.trim()) return
    AddTask(newTask).then(() => {
      setNewTask('')
      loadTasks()
    })
  }

  const deleteTask = (id) => {
    DeleteTask(id).then(loadTasks)
  }

  const toggleTask = (id) => {
    ToggleTask(id).then(loadTasks)
  }

  // 👇 Автозагрузка задач при старте
  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div>
      <h1>To-Do</h1>

      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Введите задачу"
      />
      <button onClick={addTask}>Добавить</button>

      {tasks.length > 0 ? (
        <ul>
          {tasks.map((t) => (
            <li key={t.ID}>
              <span
                style={{
                  textDecoration: t.Completed ? 'line-through' : 'none',
                  marginRight: '10px'
                }}
              >
                {t.Title}
              </span>

              <span style={{ marginRight: '10px' }}>
                {t.Completed ? '✅' : '❌'}
              </span>

              <button onClick={() => toggleTask(t.ID)}>Изменить статус</button>
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

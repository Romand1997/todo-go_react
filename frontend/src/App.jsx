import { useState } from 'react'
import { Greet, GetTasks, AddTask } from '../wailsjs/go/main/App'

function App() {
  const [name, setName] = useState('')
  const [result, setResult] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  const greet = () => {
    Greet(name).then(setResult)
  }

  const loadTasks = () => {
    GetTasks().then(setTasks)
  }

  const addTask = () => {
    if (newTask.trim() === '') return
    AddTask(newTask).then(() => {
      setNewTask('')
    //   loadTasks() // обновляем список после добавления
    })
  }

  return (
    <div>
      <h1>To-Do</h1>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Введите имя"
      />
      <button onClick={greet}>Greet</button>
      <p>{result}</p>

      <hr />

      <input
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Новая задача"
      />
      <button onClick={addTask}>Добавить задачу</button>

      <hr />

      <button onClick={loadTasks}>Загрузить задачи</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
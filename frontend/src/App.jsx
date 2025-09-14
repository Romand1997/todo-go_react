import { useState, useEffect } from 'react'
import { GetTasks, AddTask, DeleteTask, ToggleTask, UpdateTask } from '../wailsjs/go/main/App'

function App() {
  //Состояния
  const [newTask, setNewTask] = useState('')                  // название новой задачи
  const [tasks, setTasks] = useState([])                      // список всех задач
  const [editId, setEditId] = useState(null)                  // ID задачи, которую редактируем
  const [editTitle, setEditTitle] = useState('')              // новое название при редактировании
  const today = () => new Date().toISOString().slice(0, 10)    // функция, возвращающая сегодняшнюю дату в формате yyyy-mm-dd
  const [newDeadline, setNewDeadline] = useState(today)       // дедлайн новой задачи
  const [newErrors, setNewErrors] = useState({ title: '', deadline: '' }) // ошибки при добавлении
  const [editDeadline, setEditDeadline] = useState('')        // новый дедлайн при редактировании
  const [sortMode, setSortMode] = useState('deadline')        // режим сортировки задач
  const [statusFilter, setStatusFilter] = useState('all')     // фильтр по статусу (все / выполненные / активные)
  const [dateFilter, setDateFilter] = useState('all')         // фильтр по дате
  const [editErrors, setEditErrors] = useState({ title: '', deadline: '' }) // ошибки при редактировании
  const [deleteId, setDeleteId] = useState(null)               // id задачи для удаления (показывает модалку)
  const [newPriority, setNewPriority] = useState('medium')     // приоритет новой задачи
  const [editPriority, setEditPriority] = useState('medium')   // приоритет при редактировании задачи

  //Валидация добавления
  const validateNew = () => {
    const errors = { title: '', deadline: '' }
    if (!newTask.trim()) errors.title = 'Введите название задачи'
    if (!newDeadline) errors.deadline = 'Выберите дату дедлайна'
    setNewErrors(errors)
    return !errors.title && !errors.deadline
  }

  //Валидация редактирования
  const validateEdit = () => {
    const errors = { title: '', deadline: '' }
    if (!editTitle.trim()) errors.title = 'Введите название задачи'
    if (!editDeadline) errors.deadline = 'Выберите дату дедлайна'
    setEditErrors(errors)
    return !errors.title && !errors.deadline
  }

  //Фильтрация и сортировка
  const applyFiltersAndSort = () => {
    const today = new Date()
    const oneWeekLater = new Date()
    oneWeekLater.setDate(today.getDate() + 7)

    return [...tasks]
      .filter(t => {
        //фильтр по статусу
        if (statusFilter === 'completed' && !t.Completed) return false
        if (statusFilter === 'active' && t.Completed) return false

        //фильтр по дате
        if (dateFilter === 'today') {
          return t.Deadline?.slice(0, 10) === today.toISOString().slice(0, 10)
        }
        if (dateFilter === 'week') {
          if (!t.Deadline) return false
          const d = new Date(t.Deadline)
          d.setHours(23, 59, 59, 999)
          return d >= today && d <= oneWeekLater
        }
        if (dateFilter === 'overdue') {
          return !t.Completed && isExpired(t.Deadline)
        }
        return true
      })
      .sort((a, b) => {
        //сортировки
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
        if (sortMode === 'priority') {
          const order = { high: 0, medium: 1, low: 2 }
          return order[a.Priority] - order[b.Priority]
        }
        return 0
      })
  }

  //Загрузка задач из Go
  const loadTasks = () => {
    GetTasks().then(data => {
      console.log('Получены задачи:', data)
      setTasks(data || [])
    })
  }

  //Добавление новой задачи
  const addTask = () => {
    if (!validateNew()) return
    AddTask(newTask, newDeadline, newPriority).then(() => {
      setNewTask('')
      setNewDeadline(today)
      setNewErrors({ title: '', deadline: '' })
      setNewPriority('medium')
      loadTasks()
    })
  }

  //Обновление задачи
  const handleUpdate = (id) => {
    if (!validateEdit()) return
    UpdateTask(id, editTitle, editDeadline, editPriority).then(() => {
      setEditId(null)
      setEditTitle('')
      setEditDeadline('')
      setEditErrors({ title: '', deadline: '' })
      setEditPriority('medium')
      loadTasks()
    })
  }

  //Удаление задачи
  const confirmDelete = () => {
    if (!deleteId) return
    DeleteTask(deleteId).then(() => {
      setDeleteId(null)
      loadTasks()
    })
  }

  const deleteTask = (id) => {
    DeleteTask(id).then(loadTasks)
  }

  //Переключение статуса выполнения
  const toggleTask = (id) => {
    ToggleTask(id).then(loadTasks)
  }

  //Проверка просроченности задачи
  const isExpired = (date) => {
    if (!date) return false
    const today = new Date().toISOString().slice(0, 10)
    return date < today
  }

  //Загрузка задач при первом рендере
  useEffect(() => {
    loadTasks()
  }, [])



  return (
    <div>
      <h1>To-Do</h1>

      {/* Панель фильтров и сортировок */}
      <div>
        <label>Сортировка: </label>
        <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
          <option value="deadline">По дедлайну</option>
          <option value="title">По названию</option>
          <option value="status">По статусу</option>
          <option value="priority">По приоритету</option>
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

      {/* Форма добавления задачи */}
      <div style={{ marginBottom: '10px' }}>
        <input
          value={newTask}
          onChange={e => { setNewTask(e.target.value); setNewErrors({ ...newErrors, title: '' }) }}
          placeholder="Введите задачу"
          style={{ borderColor: newErrors.title ? 'red' : '' }}
        />
        {newErrors.title && <div style={{ color: 'red', fontSize: '12px' }}>{newErrors.title}</div>}

        <input
          type="date"
          value={newDeadline}
          onChange={e => { setNewDeadline(e.target.value); setNewErrors({ ...newErrors, deadline: '' }) }}
          style={{ borderColor: newErrors.deadline ? 'red' : '' }}
        />
        {newErrors.deadline && <div style={{ color: 'red', fontSize: '12px' }}>{newErrors.deadline}</div>}

        <select value={newPriority} onChange={e => setNewPriority(e.target.value)}>
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>

        <button onClick={addTask}>Добавить</button>
      </div>

      {/* Список задач */}
      {applyFiltersAndSort().length > 0 ? (
        <ul>
          {applyFiltersAndSort().map((t) => (
            <li key={t.ID}
              style={{ color: isExpired(t.Deadline) && !t.Completed ? 'red' : 'inherit' }}
            >
              {editId === t.ID ? (
                //Режим редактирования
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
                  <select value={editPriority} onChange={e => setEditPriority(e.target.value)}>
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                  <button onClick={() => handleUpdate(t.ID)}>💾</button>
                </>
              ) : (
                //Режим просмотра
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
                  <strong style={{ marginLeft: '10px' }}>({t.Priority})</strong>
                </>
              )}
              <span
                onDoubleClick={() => toggleTask(t.ID)}
                style={{ marginRight: '10px', cursor: 'pointer' }}>
                {t.Completed ? '✅' : '❌'}
              </span>
              <button onClick={() => setDeleteId(t.ID)}>Удалить</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Пока нет задач</p>
      )}

      {/*Модалка подтверждения удаления*/}
      {deleteId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '20px', borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)', textAlign: 'center',
            color: 'black'
          }}>
            <p>Вы точно хотите удалить задачу?</p>
            <button onClick={confirmDelete} style={{ marginRight: '10px' }}>Да</button>
            <button onClick={() => setDeleteId(null)}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

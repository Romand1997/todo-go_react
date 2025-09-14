package main

import (
	"context"
	"fmt"
	"time"
)

type Task struct {
	ID        int
	Title     string
	Completed bool
	Deadline  time.Time
	Priority  string
}

type App struct {
}

func NewApp() *App {
	return &App{}
}

// подключение к БД
func (a *App) startup(ctx context.Context) {
	err := InitDB()
	if err != nil {
		fmt.Println("Ошибка подключения к БД:", err)
	}
}

// Получение всех задач из БД
func (a *App) GetTasks() []Task {

	rows, err := db.Query("SELECT id, title, completed, deadline,  priority FROM tasks")
	if err != nil {
		fmt.Println("Ошибка при получении задач:", err)
		return []Task{}
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		var deadlineStr string
		if err := rows.Scan(&t.ID, &t.Title, &t.Completed, &deadlineStr, &t.Priority); err != nil {
			fmt.Println("Ошибка при чтении задачи:", err)
			continue
		}
		t.Deadline, _ = time.Parse("2006-01-02", deadlineStr)
		tasks = append(tasks, t)
	}
	return tasks
}

// Добавление задач
func (a *App) AddTask(title string, deadline string, priority string) {
	if title == "" {
		return
	}
	_, err := db.Exec("INSERT INTO tasks (title, deadline, priority) VALUES (?, ?, ?)", title, deadline, priority)
	if err != nil {
		fmt.Println("Ошибка при добавлении задачи:", err)
	}
}

// Обновление задач
func (a *App) UpdateTask(id int, newTitle string, deadline string, priority string) {
	if newTitle == "" {
		return
	}
	_, err := db.Exec("UPDATE tasks SET title = ?, deadline = ?, priority = ? WHERE id = ?", newTitle, deadline, priority, id)
	if err != nil {
		fmt.Println("Ошибка при обновлении задачи:", err)
	}
}

// Смена статуса задачи(выполнена/не выполнена)
func (a *App) ToggleTask(id int) {
	_, err := db.Exec("UPDATE tasks SET completed = NOT completed WHERE id = ?", id)
	if err != nil {
		fmt.Println("Ошибка при смене статуса:", err)
	}
}

// Удаление задачи
func (a *App) DeleteTask(id int) {
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		fmt.Println("Ошибка при удалении задачи:", err)
	}
}

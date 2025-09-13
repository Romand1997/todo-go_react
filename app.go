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
}

type App struct {
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	err := InitDB()
	if err != nil {
		fmt.Println("Ошибка подключения к БД:", err)
	}
}

// func (a *App) Greet(name string) string {
// 	return fmt.Sprintf("Hello %s, It's show time!", name)
// }

func (a *App) GetTasks() []Task {
	rows, err := db.Query("SELECT id, title, completed, deadline FROM tasks")
	if err != nil {
		fmt.Println("Ошибка при получении задач:", err)
		return []Task{}
	}
	defer rows.Close()

	// var t Task
	// 	var deadlineStr string
	// 	if err := rows.Scan(&t.ID, &t.Title, &deadlineStr); err != nil {
	// 		return nil, err
	// 	}
	// 	t.Deadline, _ = time.Parse("2006-01-02", deadlineStr)

	var tasks []Task
	for rows.Next() {
		var t Task
		var deadlineStr string
		if err := rows.Scan(&t.ID, &t.Title, &t.Completed, &deadlineStr); err != nil {
			fmt.Println("Ошибка при чтении задачи:", err)
			continue
		}
		t.Deadline, _ = time.Parse("2006-01-02", deadlineStr)
		tasks = append(tasks, t)
	}
	return tasks
}

func (a *App) AddTask(title string, deadline string) {
	if title == "" {
		return
	}
	_, err := db.Exec("INSERT INTO tasks (title, deadline) VALUES (?, ?)", title, deadline)
	if err != nil {
		fmt.Println("Ошибка при добавлении задачи:", err)
	}
}

func (a *App) UpdateTask(id int, newTitle string, deadline string) {
	if newTitle == "" {
		return
	}
	_, err := db.Exec("UPDATE tasks SET title = ?, deadline = ? WHERE id = ?", newTitle, deadline, id)
	if err != nil {
		fmt.Println("Ошибка при обновлении задачи:", err)
	}
}

func (a *App) ToggleTask(id int) {
	_, err := db.Exec("UPDATE tasks SET completed = NOT completed WHERE id = ?", id)
	if err != nil {
		fmt.Println("Ошибка при смене статуса:", err)
	}
}

func (a *App) DeleteTask(id int) {
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		fmt.Println("Ошибка при удалении задачи:", err)
	}
}

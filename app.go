package main

import "fmt"
import "context"

// App struct
type App struct {
	tasks []string
}

// NewApp создаёт новый экземпляр App
func NewApp() *App {
	return &App{
		tasks: []string{}, // пустой список задач
	}
}

func (a *App) startup(ctx context.Context) {
    // Этот метод вызывается при старте приложения
    // Можно оставить пустым
}

// Greet возвращает приветствие
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetTasks возвращает список всех задач
func (a *App) GetTasks() []string {
	return a.tasks
}

func (a *App) AddTask(task string) {
	a.tasks = append(a.tasks, task)
}
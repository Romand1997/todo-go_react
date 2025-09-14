package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

// Подключение к MySQL и создание таблицы
func InitDB() error {
	var err error

	// Подключение к БД
	dsn := "root:root@tcp(127.0.0.1:3306)/"
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}

	// Создние БД, если нет
	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS todo_db")
	if err != nil {
		return err
	}

	// Подключение к конкретной БД
	db.Close()
	db, err = sql.Open("mysql", "root:root@tcp(127.0.0.1:3306)/todo_db")
	if err != nil {
		return err
	}

	// Создаём таблицу, если нет
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS tasks (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		completed BOOLEAN NOT NULL DEFAULT 0,
		deadline TEXT,
		priority VARCHAR(10) DEFAULT 'medium'
	)`)
	if err != nil {
		return err
	}

	fmt.Println("База данных и таблица готовы!")
	return nil
}

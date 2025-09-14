To-Do List
Простое кроссплатформенное десктопное приложение для управления списком задач.
Реализовано с использованием Go (бэкенд) и React/JavaScript (фронтенд) на фреймворке Wails.

Реализованный функционал
⦁	Добавление задач с названием, дедлайном, приоритетом
⦁	Просмотр всех задач в списке
⦁	Редактирование задач (названия, дедлайна и приоритета)
⦁	Удаление задач с подтверждением (модальное окно)
⦁	Отметка задач как выполненных (зачёркивание выполненных, повторный клик снимает отметку)
⦁	Фильтрация по статусу (все, активные, выполненные)
⦁	Фильтрация по дате (все, сегодня, на неделю, просроченные)
⦁	Сортировка задач(по дате дедлайна, по названию, по статусу, по приоритету)
⦁	Сохранение состояния задач между перезапусками приложения (через MySQL через бэкенд)
⦁	Валидация ввода (пустые задачи не добавляются, проверка заполненности даты)

Запуск проекта
Установите Wails:
go install github.com/wailsapp/wails/v2/cmd/wails@latest
Установите Node.js
Установите MySQL Server имя пользователя root пароль root
Клонируйте репозиторий и установите зависимости фронтенда:
git clone https://github.com/Romand1997/todo-go_react
cd todo-go_react
npm install
Запустите проект в режиме разработки
wails dev
Соберите production-версию приложения
wails build
Сборка появится в папке build/bin/

Либо просто запустить файл todo-react.exe но на компьютере все равно должен быть установлен MySQL с имя пользователя root пароль root
Видео-демонстрация
# Build Directory

The build directory is used to house all the build files and assets for your application. 

The structure is:

* bin - Output directory
* darwin - macOS specific files
* windows - Windows specific files

## Mac

The `darwin` directory holds files specific to Mac builds.
These may be customised and used as part of the build. To return these files to the default state, simply delete them
and
build with `wails build`.

The directory contains the following files:

- `Info.plist` - the main plist file used for Mac builds. It is used when building using `wails build`.
- `Info.dev.plist` - same as the main plist file but used when building using `wails dev`.

## Windows

The `windows` directory contains the manifest and rc files used when building with `wails build`.
These may be customised for your application. To return these files to the default state, simply delete them and
build with `wails build`.

- `icon.ico` - The icon used for the application. This is used when building using `wails build`. If you wish to
  use a different icon, simply replace this file with your own. If it is missing, a new `icon.ico` file
  will be created using the `appicon.png` file in the build directory.
- `installer/*` - The files used to create the Windows installer. These are used when building using `wails build`.
- `info.json` - Application details used for Windows builds. The data here will be used by the Windows installer,
  as well as the application itself (right click the exe -> properties -> details)
- `wails.exe.manifest` - The main application manifest file.
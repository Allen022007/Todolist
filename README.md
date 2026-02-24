# Ex03 To-Do List using JavaScript
## Date: 17.02.2026

```
Name : W Allen Johnston Ozario
Reg. No : 212224110004
```

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

## PROGRAM

### index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 My Tasks</h1>
            <p class="date" id="currentDate"></p>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <span class="stat-number" id="totalTasks">0</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="completedTasks">0</span>
                <span class="stat-label">Completed</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="pendingTasks">0</span>
                <span class="stat-label">Pending</span>
            </div>
        </div>

        <div class="input-section">
            <input type="text" id="taskInput" placeholder="What needs to be done?">
            <button id="addBtn">+ Add Task</button>
        </div>

        <div class="filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="pending">Pending</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>

        <ul id="taskList"></ul>

        <div class="footer">
            <button id="clearBtn">Clear Completed</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### style.css
```
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background: white;
    padding: 0;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 550px;
    overflow: hidden;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

.header h1 {
    font-size: 32px;
    margin-bottom: 5px;
}

.date {
    font-size: 14px;
    opacity: 0.9;
}

.stats {
    display: flex;
    justify-content: space-around;
    padding: 25px;
    background: #f8f9fc;
    border-bottom: 1px solid #e0e0e0;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 28px;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 5px;
}
```

### script.js
```
// Get elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentDate = document.getElementById('currentDate');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Display current date
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
currentDate.textContent = today.toLocaleDateString('en-US', options);

// Display tasks on page load
displayTasks();
updateStats();

// Add task event
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Clear completed tasks
clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    displayTasks();
    updateStats();
});

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        displayTasks();
    });
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.unshift(task);
    saveTasks();
    displayTasks();
    updateStats();
    taskInput.value = '';
}

function displayTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state"><p>📭 No tasks to show</p></div>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? '↩️' : '✓'}</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
        
        // Toggle completion
        li.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
            updateStats();
        });
        
        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            displayTasks();
            updateStats();
        });
        
        taskList.appendChild(li);
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
```

## OUTPUT
<img width="1919" height="1046" alt="image" src="https://github.com/user-attachments/assets/52b1b8b1-aead-44a3-933f-d1f042c9f94e" />

<img width="1919" height="1043" alt="Screenshot 2026-02-24 103831" src="https://github.com/user-attachments/assets/cf6ed93b-e957-4587-86c1-db3e9e9e1951" />

<img width="1919" height="1041" alt="Screenshot 2026-02-24 103843" src="https://github.com/user-attachments/assets/e657c2fe-4f93-463a-91f3-631c84344a23" />

## RESULT
The program for creating To-do list using JavaScript is executed successfully.

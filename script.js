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

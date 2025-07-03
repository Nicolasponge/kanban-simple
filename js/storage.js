import { createTaskElement } from './taskUtils.js';

export function saveState() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    tasks.push({
      name: task.querySelector('span').textContent,
      column: task.parentElement.id,
      priority: task.classList.contains('priority-high')
        ? 'priority-high'
        : task.classList.contains('priority-medium')
        ? 'priority-medium'
        : 'priority-low'
    });
  });
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}

export function loadState() {
  const data = JSON.parse(localStorage.getItem('kanbanTasks')) || [];
  data.forEach(task => {
    createTaskElement(task.name, task.column, task.priority);
  });
}

export function clearState() {
  localStorage.removeItem('kanbanTasks');
}

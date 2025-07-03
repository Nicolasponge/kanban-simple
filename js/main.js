import { createTaskElement, updateCounters } from './taskUtils.js';
import { saveState, loadState, clearState } from './storage.js';
import { enableDragAndDrop } from './dragAndDrop.js';

const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-button');
const clearStorageButton = document.getElementById('clear-storage-button');
const columns = document.querySelectorAll('.column');
const todoColumn = document.getElementById('todo');

// Adicionar tarefa
addTaskButton.addEventListener('click', () => {
  const taskName = newTaskInput.value.trim();
  if (taskName) {
    const taskEl = createTaskElement(taskName);
    todoColumn.appendChild(taskEl);
    highlightColumn(todoColumn);
    newTaskInput.value = '';
    updateCounters();
    saveState();
  }
});

// Limpar todas as tarefas salvas
clearStorageButton.addEventListener('click', () => {
  if (confirm("Tem certeza que deseja apagar todas as tarefas?")) {
    localStorage.removeItem('kanbanTasks');
    location.reload(); // recarrega a página limpinha
  }
});

// Drag & Drop entre colunas
columns.forEach(column => {
  column.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    column.appendChild(dragging);
    highlightColumn(column);
  });

  column.addEventListener('drop', () => {
    updateCounters();
    saveState();
    
  });
});

// Animação de glow
function highlightColumn(columnElement) {
    columnElement.classList.add('column-glow');
    setTimeout(() => {
        columnElement.classList.remove('column-glow');
    }, 800); // Duração da animação em ms
}


// Carrega tarefas do localStorage
loadState();
updateCounters();

import { saveState } from './storage.js';

export function createTaskElement(name, columnId = 'todo', priority = 'priority-low') {
  const task = document.createElement('div');
  task.className = `task to-do ${priority}`;
  task.draggable = true;

  const span = document.createElement('span');
  span.textContent = name;

  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
marker.setAttribute('viewBox', '0 0 512 512');
marker.setAttribute('width', '24');
marker.setAttribute('height', '24');
marker.setAttribute('class', `priority-marker ${priority}`);
marker.innerHTML = `
  <g transform="translate(0,512) scale(0.1,-0.1)" fill="currentColor" stroke="none">
    <path d="M1442 5101 c-63 -22 -123 -76 -155 -141 l-22 -45 -3 -2433 -2 -2433
      24 -24 c25 -25 50 -31 81 -19 9 4 270 268 581 588 311 319 575 585 588 590
      13 5 34 6 47 3 14 -4 243 -233 544 -543 286 -294 546 -560 577 -590 64 -61 95
      -68 134 -29 l24 24 -2 2433 c-3 2250 -4 2436 -20 2470 -28 62 -94 125 -154
      148 -54 20 -72 20 -1122 20 -1010 -1 -1070 -2 -1120 -19z"/>
  </g>`;


  marker.addEventListener('click', () => {
    togglePriority(marker);
    saveState();
  });

  const trash = document.createElement('span');
  trash.className = 'trashcan';
  trash.innerHTML = '&#128465;';
  trash.addEventListener('click', () => {
    trash.classList.add('delete');
    task.classList.add('deleting');
    setTimeout(() => {
      task.remove();
      updateCounters();
      saveState();
    }, 500);
  });

  task.append(span, marker, trash);
  enableTaskEditing(task);
  enableDrag(task);
  document.getElementById(columnId).appendChild(task);
  updateTaskColors(task);
  return task;
}

function togglePriority(marker) {
    const task = marker.parentElement;
    const currentPriority = marker.classList.contains('priority-low') ? 'low'
                          : marker.classList.contains('priority-medium') ? 'medium'
                          : 'high';
  
    const nextPriority = currentPriority === 'low' ? 'medium'
                      : currentPriority === 'medium' ? 'high'
                      : 'low';
  
    task.classList.remove('priority-low', 'priority-medium', 'priority-high');
    marker.classList.remove('priority-low', 'priority-medium', 'priority-high');
  
    task.classList.add(`priority-${nextPriority}`);
    marker.classList.add(`priority-${nextPriority}`);
}

export function enableTaskEditing(task) {
  task.addEventListener('dblclick', () => {
    task.setAttribute('contenteditable', 'true');
    task.focus();
  });
  task.addEventListener('blur', () => {
    task.removeAttribute('contenteditable');
    saveState();
  });
}

function enableDrag(task) {
  task.addEventListener('dragstart', () => task.classList.add('dragging'));
  task.addEventListener('dragend', () => {
    task.classList.remove('dragging');
    updateTaskColors(task);
    updateCounters();
    saveState();
  });
}

export function updateTaskColors(task) {
  task.classList.remove('to-do', 'in-progress', 'done');
  const col = task.parentElement.id;
  if (col === 'todo') task.classList.add('to-do');
  if (col === 'in-progress') task.classList.add('in-progress');
  if (col === 'done') task.classList.add('done');
}

export function updateCounters() {
  ['todo', 'in-progress', 'done'].forEach(id => {
    const count = document.getElementById(id).querySelectorAll('.task').length;
    document.getElementById(`${id}-counter`).textContent = `${count} tasks`;
  });
}

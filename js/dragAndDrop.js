export function enableDragAndDrop(task) {
    task.addEventListener('dragstart', () => task.classList.add('dragging'));
    task.addEventListener('dragend', () => task.classList.remove('dragging'));
  }
  
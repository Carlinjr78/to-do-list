
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.querySelector('.close-btn');
    const todoForm = document.getElementById('todo-form');
    const todoTable = document.getElementById('todo-table').getElementsByTagName('tbody')[0];
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    const completeModal = document.getElementById('complete-modal');
    const confirmCompleteBtn = document.getElementById('confirm-complete-btn');
    const cancelCompleteBtn = document.getElementById('cancel-complete-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let taskToDelete = null;
    let taskToComplete = null;

    const renderTodos = () => {
        todoTable.innerHTML = '';
        todos.forEach((todo, index) => {
            const row = todoTable.insertRow();
            row.innerHTML = `
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${new Date(todo.createdAt).toLocaleDateString()}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="complete-btn" data-index="${index}">Concluir</button>
                    <button class="delete-btn" data-index="${index}">Excluir</button>
                </td>
            `;
        });
    };

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const addTodo = (title, description) => {
        const newTodo = {
            title,
            description,
            createdAt: new Date(),
            status: 'Pendente'
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        closeModal(modal);
    };

    const openModal = (modalElement) => {
        modalElement.style.display = 'block';
    };

    const closeModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    openModalBtn.addEventListener('click', () => openModal(modal));
    closeBtn.addEventListener('click', () => closeModal(modal));
    window.addEventListener('click', (e) => {
        if (e.target == modal || e.target == deleteModal || e.target == completeModal) {
            closeModal(modal);
            closeModal(deleteModal);
            closeModal(completeModal);
        }
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        if (title) {
            addTodo(title, description);
            titleInput.value = '';
            descriptionInput.value = '';
        }
    });

    todoTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            taskToDelete = e.target.dataset.index;
            openModal(deleteModal);
        }

        if (e.target.classList.contains('complete-btn')) {
            taskToComplete = e.target.dataset.index;
            openModal(completeModal);
        }
    });

    cancelDeleteBtn.addEventListener('click', () => {
        closeModal(deleteModal);
        taskToDelete = null;
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (taskToDelete !== null) {
            todos.splice(taskToDelete, 1);
            saveTodos();
            renderTodos();
            closeModal(deleteModal);
            taskToDelete = null;
        }
    });

    cancelCompleteBtn.addEventListener('click', () => {
        closeModal(completeModal);
        taskToComplete = null;
    });

    confirmCompleteBtn.addEventListener('click', () => {
        if (taskToComplete !== null) {
            todos[taskToComplete].status = 'Concluída';
            saveTodos();
            renderTodos();
            closeModal(completeModal);
            taskToComplete = null;
        }
    });

    renderTodos();
});

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    const updateThemeIcons = () => {
        if (document.body.classList.contains('dark')) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    };

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    updateThemeIcons();

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcons();
    });

    // Clock
    const clockElement = document.getElementById('clock');
    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // Modal
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.querySelector('.close-btn');
    const openModal = (modalElement) => {
        modalElement.classList.remove('hidden');
    };
    const closeModal = (modalElement) => {
        modalElement.classList.add('hidden');
    };
    openModalBtn.addEventListener('click', () => openModal(modal));
    closeBtn.addEventListener('click', () => closeModal(modal));
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal(modal);
        }
        if (e.target == confirmationModal) {
            closeModal(confirmationModal);
        }
    });

    // Confirmation Modal
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationModalTitle = document.getElementById('confirmation-modal-title');
    const confirmationModalText = document.getElementById('confirmation-modal-text');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    let action = null;
    let taskIndex = null;

    const showConfirmationModal = (title, text, actionType, index) => {
        confirmationModalTitle.textContent = title;
        confirmationModalText.textContent = text;
        action = actionType;
        taskIndex = index;
        openModal(confirmationModal);
    };

    cancelBtn.addEventListener('click', () => {
        closeModal(confirmationModal);
        action = null;
        taskIndex = null;
    });

    // To-Do
    const todoForm = document.getElementById('todo-form');
    const todoTable = document.getElementById('todo-table').getElementsByTagName('tbody')[0];
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const renderTodos = () => {
        todoTable.innerHTML = '';
        todos.forEach((todo, index) => {
            const row = todoTable.insertRow();
            row.innerHTML = `
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${todo.title}</td>
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${todo.description}</td>
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${new Date(todo.createdAt).toLocaleDateString('pt-BR')}</td>
                <td class="py-2 px-4 border-b">${todo.status}</td>
                <td class="py-2 px-4 border-b">
                    <div class="flex gap-2">
                        <button class="complete-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">${todo.status === 'Concluída' ? 'Reabrir' : 'Concluir'}</button>
                        <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">Excluir</button>
                    </div>
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
            const index = e.target.dataset.index;
            showConfirmationModal('Excluir Tarefa', 'Você tem certeza que deseja excluir esta tarefa?', 'delete', index);
        }

        if (e.target.classList.contains('complete-btn')) {
            const index = e.target.dataset.index;
            showConfirmationModal('Concluir Tarefa', 'Você tem certeza que deseja alterar a situação desta tarefa?', 'complete', index);
        }
    });

    confirmBtn.addEventListener('click', () => {
        if (action === 'delete' && taskIndex !== null) {
            todos.splice(taskIndex, 1);
        } else if (action === 'complete' && taskIndex !== null) {
            if (todos[taskIndex].status === 'Concluída') {
                todos[taskIndex].status = 'Pendente';
            } else {
                todos[taskIndex].status = 'Concluída';
            }
        }
        saveTodos();
        renderTodos();
        closeModal(confirmationModal);
        action = null;
        taskIndex = null;
    });

    renderTodos();
});

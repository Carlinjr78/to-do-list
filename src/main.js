// Espera o conteúdo do DOM ser totalmente carregado para executar o script

document.addEventListener('DOMContentLoaded', () => {
    // Seletor de tema
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Função para atualizar os ícones do tema
    const updateThemeIcons = () => {
        if (document.body.classList.contains('dark')) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    };

    // Verifica se o tema escuro está salvo no localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
    updateThemeIcons();

    // Adiciona o evento de clique para alternar o tema
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcons();
    });

    // Relógio
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

    // Modal de confirmação
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationModalTitle = document.getElementById('confirmation-modal-title');
    const confirmationModalText = document.getElementById('confirmation-modal-text');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    let action = null;
    let taskIndex = null;

    // Função para exibir o modal de confirmação
    const showConfirmationModal = (title, text, actionType, index) => {
        confirmationModalTitle.textContent = title;
        confirmationModalText.textContent = text;
        action = actionType;
        taskIndex = index;
        openModal(confirmationModal);
    };

    // Adiciona o evento de clique para o botão de cancelar
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
    let currentFilter = 'all'; // 'all', 'pending', 'completed'

    const renderTodos = () => {
        todoTable.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') {
                return true;
            }
            if (currentFilter === 'pending') {
                return todo.status === 'Pendente';
            }
            if (currentFilter === 'completed') {
                return todo.status === 'Concluída';
            }
        });

        filteredTodos.forEach((todo, index) => {
            const originalIndex = todos.indexOf(todo);
            const row = todoTable.insertRow();
            row.innerHTML = `
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${todo.title}</td>
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${todo.description}</td>
                <td class="py-2 px-4 border-b ${todo.status === 'Concluída' ? 'completed' : ''}">${new Date(todo.createdAt).toLocaleDateString('pt-BR')}</td>
                <td class="py-2 px-4 border-b">${todo.status}</td>
                <td class="py-2 px-4 border-b">
                    <div class="flex gap-2">
                        <button class="complete-btn bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-index="${originalIndex}">${todo.status === 'Concluída' ? 'Reabrir' : 'Concluir'}</button>
                        <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-index="${originalIndex}">Excluir</button>
                    </div>
                </td>
            `;
        });
    };

    // Função para salvar as tarefas no localStorage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Função para adicionar uma nova tarefa
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

    // Adiciona o evento de submit para o formulário de tarefas
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

    // Adiciona o evento de clique para a tabela de tarefas
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

    // Adiciona o evento de clique para o botão de confirmação
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

    // Renderiza as tarefas ao carregar a página
    renderTodos();

    // Filtros
    const filterAllBtn = document.getElementById('filter-all');
    const filterPendingBtn = document.getElementById('filter-pending');
    const filterCompletedBtn = document.getElementById('filter-completed');

    const updateFilterButtons = () => {
        filterAllBtn.classList.toggle('bg-blue-500', currentFilter === 'all');
        filterAllBtn.classList.toggle('text-white', currentFilter === 'all');
        filterPendingBtn.classList.toggle('bg-blue-500', currentFilter === 'pending');
        filterPendingBtn.classList.toggle('text-white', currentFilter === 'pending');
        filterCompletedBtn.classList.toggle('bg-blue-500', currentFilter === 'completed');
        filterCompletedBtn.classList.toggle('text-white', currentFilter === 'completed');
    };

    filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        updateFilterButtons();
        renderTodos();
    });

    filterPendingBtn.addEventListener('click', () => {
        currentFilter = 'pending';
        updateFilterButtons();
        renderTodos();
    });

    filterCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        updateFilterButtons();
        renderTodos();
    });

    updateFilterButtons();
});
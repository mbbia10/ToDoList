let timers = {};

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskDesc = document.getElementById('task-desc');
    const taskDate = document.getElementById('task-date');
    const taskType = document.getElementById('task-type').value; 
    const taskText = taskInput.value.trim();
    const taskDescription = taskDesc.value.trim();
    const dateText = taskDate.value;

    if (taskText && dateText) {
        const taskListOpen = document.getElementById('task-list-open');
        const newTask = document.createElement('li');
        const taskId = Date.now();  
        newTask.setAttribute('id', `task-${taskId}`);

        if (taskType === 'escolar') {
            newTask.innerHTML = `
                <div class="task-title">${taskText} - ${dateText} (Escolar)</div>
                <div class="task-desc">${taskDescription}</div>
                <div class="timer-container">
                    <span id="timer-${taskId}">00:00:00</span>
                </div>
                <div class="action-buttons">
                    <button class="start-button" onclick="startTask(${taskId})">Iniciar</button>
                    <button class="finish-button" onclick="finishTask(${taskId})" disabled>Finalizar</button>
                    <button class="edit-button" onclick="editTask(${taskId})">Editar</button>
                </div>
                <div class="delete-button-container">
                    <button class="delete-button" onclick="removeTask(${taskId})">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            `;
        } else {
         
            newTask.innerHTML = `
                <div class="task-title">${taskText} - ${dateText} (Geral)</div>
                <div class="task-desc">${taskDescription}</div>
                <div class="action-buttons">
                    <button class="finish-button" onclick="finishTask(${taskId})">Concluir</button>
                    <button class="edit-button" onclick="editTask(${taskId})">Editar</button>
                    <button class="delete-button" onclick="removeTask(${taskId})">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            `;
        }

        taskListOpen.appendChild(newTask);

       
        taskInput.value = ''; 
        taskDesc.value = '';
        taskDate.value = '';
        updateTaskCount();
    } else {
        alert('Por favor, digite uma tarefa, uma descrição e selecione uma data.');
    }
}

function removeTask(taskId) {
    const taskItem = document.getElementById(`task-${taskId}`);
    if (timers[taskId]) {
        clearInterval(timers[taskId]);
        delete timers[taskId];
    }
    taskItem.remove();
    updateTaskCount();
}

function startTask(taskId) {
    const startButton = document.querySelector(`#task-${taskId} .start-button`);
    const finishButton = document.querySelector(`#task-${taskId} .finish-button`);
    startButton.disabled = true;
    finishButton.disabled = false;

    let timerElement = document.getElementById(`timer-${taskId}`);
    let startTime = Date.now();

    timers[taskId] = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

        timerElement.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
}

function finishTask(taskId) {
    const taskItem = document.getElementById(`task-${taskId}`);
    const taskListDone = document.getElementById('task-list-done');
    const completionDate = new Date().toLocaleDateString();

    taskItem.querySelector('.start-button')?.remove();  
    taskItem.querySelector('.finish-button').remove();

    const completionInfo = document.createElement('div');
    completionInfo.textContent = `Concluído em: ${completionDate}`;
    taskItem.appendChild(completionInfo);

    taskListDone.appendChild(taskItem);
    clearInterval(timers[taskId]);
    delete timers[taskId];
}

function editTask(taskId) {
    const taskItem = document.getElementById(`task-${taskId}`);
    const titleElement = taskItem.querySelector('.task-title');
    const descElement = taskItem.querySelector('.task-desc');
    const [titleText, dateText] = titleElement.textContent.split(' - ');

    const newTitle = prompt('Edite o título da tarefa:', titleText);
    const newDate = prompt('Edite a data da tarefa:', dateText);
    const newDesc = prompt('Edite a descrição da tarefa:', descElement.textContent);

    if (newTitle && newDate && newDesc) {
        titleElement.textContent = `${newTitle} - ${newDate}`;
        descElement.textContent = newDesc;
    }
}

function pad(number) {
    return number < 10 ? `0${number}` : number;
}

function updateTaskCount() {
    const taskCount = document.getElementById('task-list-open').children.length;
    document.getElementById('task-count').innerText = `Total de Tarefas: ${taskCount}`;
}

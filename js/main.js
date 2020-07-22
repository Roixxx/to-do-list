
const addBtn = document.querySelector(".todo__input-btn");
const inputText = document.querySelector(".todo__input-text");
const tasksListField = document.querySelector(".todo__list");



let tasksList = [];

if (localStorage.getItem('tasks')) {
    tasksList = parseTasks();
    loadTasks();
} 


function parseTasks() { 
    return JSON.parse(localStorage.getItem('tasks'));
}

function loadTasks() {
    parseTasks().forEach(task => {
        generateHtmlTask(task);
    });
}


function generateTask() { 
    
    let task = {
        todo: inputText.value,
        date: 1703,
        checked: false,
        taskId: tasksList.length,
    }

    tasksList.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasksList));

    let lastTask = tasksList[tasksList.length - 1];
    generateHtmlTask(lastTask);

}

function generateHtmlTask(task) {
    let taskHtml = 
    `<li class="todo__item" data-taskId="${task.taskId}"> 
        <p class="todo__task">${task.todo}</p> 
        <div>
            <input class="todo__delete" onclick="delTask(this)" type="button" value="delete">
            <input class="todo__edit" onclick="editTask(this)" type="button" value="edit">
        </div>
    </li>`;
    addTask(taskHtml);
}

function addTask(taskHtml) {

    tasksListField.innerHTML += taskHtml; 
    inputText.focus();
    clearInputText();
}

function delTask(target) {
    target = target.parentNode.parentNode;
    let targetId = target.dataset.taskid;

    tasksList = tasksList.splice(targetId, 1);
    localStorage.setItem('tasks', JSON.stringify(tasksList));

    target.remove();
}

function editTask(target) {
    target = target.parentNode.previousElementSibling;
    
    target.setAttribute('contentEditable', 'true');
    target.focus();
}

function clearInputText() {
    inputText.value = '';
}





addBtn.onclick = function () {
    if (!inputText.value) return;
    generateTask();
}


inputText.onkeypress = function (e) {
    e.key == 'Enter' ? generateTask() : null; 
}




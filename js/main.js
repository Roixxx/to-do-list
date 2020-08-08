
const addTaskBtn = document.querySelector(".todo__input-btn");
const inputText = document.querySelector(".todo__input-text");
let tasksListField = document.querySelector(".todo__list");



let tasksList = [];

if (localStorage.getItem('tasks')) {
    tasksList = parseTasks();
    loadTasks();
    new SimpleBar(document.querySelector('.todo__list'));
    tasksListField = document.querySelector(".simplebar-content");
} 
const simpleBar = new SimpleBar(document.querySelector('.todo__list'));
const containerScroll = document.querySelector('.simplebar-content-wrapper'); 


function parseTasks() { 
    return JSON.parse(localStorage.getItem('tasks'));
}

function loadTasks() {
    parseTasks().forEach(task => {
        generateHtmlTask(task);
    });
}

function generateTask(isUserTask) { 

    let task = {
        todo: inputText.value,
        date: generateDate(),
        checked: false,
        taskId: tasksList.length,
    }

    tasksList.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasksList));

    let lastTask = tasksList[tasksList.length - 1];
    generateHtmlTask(lastTask);

}

function generateDate() { 
    let date = new Date();
    let day = date.getDate();
    let month = twoDigits( date.getMonth() + 1) ;

    function twoDigits(num) {
        return ('0' + num).slice(-2);
    }

    return day + '/' + month;
}

function generateHtmlTask(task) {
    let taskHtml = 
    `<li class="todo__item" data-taskId="${task.taskId}"> 
        <input class="todo__checkbox" type="checkbox" onclick="completeTask(this)">

        <p class="todo__task">${task.todo}</p> 
        <div class="todo__btns-holder">
            <input class="todo__edit" onclick="editTask(this)" type="button" value="edit">
            <input class="todo__delete" onclick="delTask(this)" type="button">
        </div>

        <p class="todo__date">${task.date}</p>
    </li>`;
    addTask(taskHtml);
}

function addTask(taskHtml) {

    tasksListField.innerHTML += taskHtml; 
    inputText.focus();
    clearInputText();
}

function completeTask(task) {
    return;
}

function delTask(target) {
    target = target.parentNode.parentNode;
    let targetId = target.dataset.taskid;

    tasksList.forEach((task, id) => {
        
        if (task.taskId == targetId) {
            tasksList.splice(id, 1)
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasksList));

    target.remove();
}

function editTask(target) {
    tasksListField.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('Save your changes first');
        inputText.focus();
    }, true);

    target = target.parentNode.previousElementSibling;
    target.classList.add('task-editing');

    addTaskBtn.value = 'save';
    addTaskBtn.setAttribute('onclick', 'saveEditedTask(true)');

    inputText.value = target.textContent;
    inputText.onkeypress = (e) => saveEditedTask(e.key == 'Enter');

    inputText.focus();   
}

function saveEditedTask(isTrueKey) {

    if (!isTrueKey) return;

    let editedTask = tasksListField.querySelector('.task-editing');
    let editedTaskId = editedTask.parentNode.dataset.taskid;

    editedTask.textContent = inputText.value;
    
    tasksList.forEach(task => {
        if (task.taskId == editedTaskId)  {
            task.todo = editedTask.textContent;
            localStorage.setItem('tasks', JSON.stringify(tasksList));
        }
    });
    window.location.reload();
}

function clearInputText() {
    inputText.value = '';
}

function validateTaskAdding(isTrueKey) { 
    if (!inputText.value) return;
    if (!isTrueKey) return;

    generateTask();
    let scrollHeight = containerScroll.firstChild.clientHeight;
    containerScroll.scrollTo({ top: scrollHeight, behavior: "smooth" });
}

addTaskBtn.onclick = () => validateTaskAdding(true);
    
inputText.onkeypress = (e) => validateTaskAdding(e.key == 'Enter');

//to do 1) editTask, сделать показ времени с помощью класса.



const addBtn = document.querySelector(".todo__input-btn");
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
            <input class="todo__delete" onclick="delTask(this)" type="button" value="delete">
            <input class="todo__edit" onclick="editTask(this)" type="button" value="edit">
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

    tasksList.splice(targetId, 1);
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

function validateTaskAdding(isTrueKey) { 
    if (!inputText.value) return;
    if (!isTrueKey) return;

    generateTask();
    let scrollHeight = containerScroll.firstChild.clientHeight;
    containerScroll.scrollTo({ top: scrollHeight, behavior: "smooth" });
}

addBtn.onclick = () => validateTaskAdding(true);
    
inputText.onkeypress = (e) => validateTaskAdding(e.key == 'Enter');

//to do 1) пофиксить edit and delete funcs, сделать показ времени с помощью класса.
const todoBox = document.querySelector('.todo__box');
const intro = document.querySelector('.todo__intro');
const listMask = document.querySelector('.todo__list-mask');
const inputBox = document.querySelector('.todo__input-box');

const tasksLeft = document.querySelector('.todo__tasks-left');
const introDate = document.querySelector('.todo__intro-date');

const addTaskBtn = document.querySelector('.todo__input-btn');
const inputText = document.querySelector('.todo__input-text');

const todoList = document.querySelector('.todo__list');
const introBtns = Array.from(document.querySelectorAll('.todo__intro-btn'));

let tasksListField;
let containerScroll;
let tasksList = [];



window.onload = () => {
    generateDate();
    calcListMaskHeight();
    new SimpleBar(todoList);
    tasksListField = document.querySelector(".simplebar-content");
    containerScroll = document.querySelector('.simplebar-content-wrapper'); 

    if (localStorage.getItem('tasks')) {
        loadTasks();
        calcTasksLeft();   
    }
}

function parseTasks() { 
    let tasksArrFromStorage = JSON.parse(localStorage.getItem('tasks'));
    tasksList = tasksArrFromStorage;
    return tasksArrFromStorage;
}

function loadTasks() {
    parseTasks().forEach(task => {
        generateHtmlTask(task);
    });
}

function generateTask() { 
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

function calcTasksLeft() {
    let left = 0;
    tasksList.forEach( t => !t.checked ? left++ : null );
    tasksLeft.textContent = left;
}

function generateDate() { 
    let date = new Date();
    let day = date.getDate();
    let month = twoDigits( date.getMonth() + 1);
    let weekday = date.toLocaleDateString('en-us', {weekday: 'long'});

    function twoDigits(num) {
        return ('0' + num).slice(-2);
    }

    introDate.textContent = `${day}.${month}, ${weekday}`;
    return day + '/' + month;
}

function generateHtmlTask(task) {
    let itemClass = 'todo__item';
    let isChecked = '';
    
    if (task.checked) {
        itemClass = 'todo__item checked';
        isChecked = 'checked';
    }

    let taskHtml = 
    `<li class="${itemClass}" data-taskId="${task.taskId}"> 
        <input class="todo__checkbox" type="checkbox" ${isChecked} onclick="completeTask(this)">

        <p class="todo__task">${task.todo}</p> 
        <div class="todo__btns-holder">
            <input class="todo__edit" onclick="editTask(this)" type="button" title="edit">
            <input class="todo__delete" onclick="delTask(this)" type="button" title="delete">
        </div>

        <p class="todo__date">${task.date}</p>
    </li>`;
    addTask(taskHtml);
}

function addTask(taskHtml) {

    tasksListField.innerHTML += taskHtml; 
    inputText.focus();
    clearInputText();
    calcTasksLeft();
}

function completeTask(task) {
    task = task.parentNode;
    currentTaskId = task.dataset.taskid;

    tasksList.forEach(task => {
        if (task.taskId == currentTaskId)  {
            task.checked = !task.checked;
            localStorage.setItem('tasks', JSON.stringify(tasksList));
        }
    });

    task.classList.toggle('checked');
    calcTasksLeft();
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
    calcTasksLeft();
}

function editTask(target) {
    tasksListField.addEventListener('click', (e) => {
        e.stopPropagation();
        editingWarning('Save your changes first');
        inputText.focus();
    }, true);

    target = target.parentNode.parentNode;
    target.classList.add('task-editing');
    
    addTaskBtn.style.backgroundImage = "url('../img/save.svg')";
    addTaskBtn.setAttribute('onclick', 'saveEditedTask(true)');

    inputText.value = target.querySelector('.todo__task').textContent;
    inputText.onkeypress = (e) => saveEditedTask(e.key == 'Enter');

    inputText.focus();   
}

function saveEditedTask(isTrueKey) {

    if (!isTrueKey) return;

    let editedTaskId = tasksListField.querySelector('.task-editing').dataset.taskid;
    currentTab = document.querySelector('.todo__intro-btn.active');
   
    tasksList.forEach(task => {
        if (task.taskId == editedTaskId)  {
            task.todo = inputText.value;
            localStorage.setItem('tasks', JSON.stringify(tasksList));
        }
    });
    window.location.reload();
}

function clearInputText() {
    inputText.value = '';
}

function switchMode(btn) { 
    todoList.classList = ('todo__list ' + btn.value.toLowerCase() + '-mode');

    introBtns.forEach(btn => btn.classList = btn.classList[0]);
    btn.classList.add('active');
}

function validateTaskAdding(isTrueKey) { 
    if (!inputText.value) return;
    if (!isTrueKey) return;

    generateTask();
    let scrollHeight = containerScroll.firstChild.clientHeight;
    containerScroll.scrollTo({ top: scrollHeight, behavior: "smooth" });
}

function calcListMaskHeight() {
   listMask.style.height = todoBox.clientHeight - intro.clientHeight - inputBox.clientHeight + 'px';
}

function editingWarning(message) {
    console.log(message)
}




addTaskBtn.onclick = () => validateTaskAdding(true);
inputText.onkeypress = (e) => validateTaskAdding(e.key == 'Enter');
window.onresize = calcListMaskHeight;
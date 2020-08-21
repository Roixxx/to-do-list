
const introDate = document.querySelector(".todo__intro-date");
const addTaskBtn = document.querySelector(".todo__input-btn");
const inputText = document.querySelector(".todo__input-text");
//const checkbox = document.querySelector('.todo__checkbox');
let tasksListField = document.querySelector(".todo__list");




let tasksList = [];

if (localStorage.getItem('tasks')) {
    tasksList = parseTasks();
    loadTasks();
    generateDate();
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

    target = target.parentNode.parentNode;
    target.classList.add('task-editing');
    
    addTaskBtn.value = 'save';
    addTaskBtn.setAttribute('onclick', 'saveEditedTask(true)');

    inputText.value = target.querySelector('.todo__task').textContent;
    inputText.onkeypress = (e) => saveEditedTask(e.key == 'Enter');

    inputText.focus();   
}

function saveEditedTask(isTrueKey) {

    if (!isTrueKey) return;

    let editedTaskId = tasksListField.querySelector('.task-editing').dataset.taskid;
   
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

function validateTaskAdding(isTrueKey) { 
    if (!inputText.value) return;
    if (!isTrueKey) return;

    generateTask();
    let scrollHeight = containerScroll.firstChild.clientHeight;
    containerScroll.scrollTo({ top: scrollHeight, behavior: "smooth" });
}



addTaskBtn.onclick = () => validateTaskAdding(true);
    
inputText.onkeypress = (e) => validateTaskAdding(e.key == 'Enter');





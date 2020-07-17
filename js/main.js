const addBtn = document.querySelector(".todo__input-btn");
const inputText = document.querySelector(".todo__input-text");
const tasksListField = document.querySelector(".todo__list");



let tasksList = [];


function generateTask() { 
    
    let task = {
        todo: inputText.value,
        date: 1703,
        checked: false,
    }

    tasksList.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasksList));
    addTask();

}

function addTask() {

    let tasksArr = JSON.parse(localStorage.getItem('tasks'));
    let task = tasksArr[tasksArr.length - 1];

    tasksListField.innerHTML += `<li> ${task.todo} </li>`; 
    

    clearInputText();
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

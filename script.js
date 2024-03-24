const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//adicionar ou atualizar tarefa
const addOrUpdateTask = () => {
    
  addOrUpdateTaskBtn.innerText = "Add Task";//colocar Add task no botão
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id); //checar se a tarefa adicionada já existe ou não
  
  //criar uma id para cada tarefa criada
  const taskObj = {
    //propriedades do objeto
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

//adicionar a nova tarefa SE já não existir
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer()
  reset()
};

const updateTaskContainer = () => { 
  tasksContainer.innerHTML = ""; //limpar taskContainer

  //display the task on the page by looping through it.
  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p class="task-title">${title}</p>
          <p class="task-date">${date}</p>
          <p class="task-description">${description}</p>
          
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
          
        </div>
      `)
    }
  );
};

//remover tarefa
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id);

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);

  localStorage.setItem("data", JSON.stringify(taskData));//remove from localStorage
}

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden"); //display the form 
}

//limpar o input depois de cada tarefa adicionada
const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

//checar se existe uma tarefa dentro do banco de dados
if (taskData.length) {
    updateTaskContainer()
}

//abrir aba quando clicar em 'add new task'
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

//quando tentar fechar a aba de formulario, abrir aba 'discard unsaved changes'
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  //checar se formInputsContainValues possui algum valor e decidir se será ou não descartado
    //the Cancel and Discard buttons in the modal won't be displayed to the user if they haven't made any changes to the input fields while attempting to edit a task.
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

//fechar aba formulario ao clicar em 'cancel'
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

//fechar as duas abas ao clicar em 'discard'
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

//stop the browser from refreshing the page after submitting the form.
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});
const inputBox=document.getElementById("input_box");
const listContainer=document.getElementById("list_container");
const prioritySelect = document.getElementById("priority_select");
const departmentSelect = document.getElementById("department_select");
const filterOptions = document.getElementById("filter-options");
const sortOptions = document.getElementById("sort-options");
const modifyButtons = document.getElementById("modify-buttons");
let selectedDepartment = null;


function addTask(){
    if(inputBox.value===""){
        alert("You must write something!");
    }else if (prioritySelect.value === "") {
        alert("Please select a priority!");
    }else if(departmentSelect.value === ""){
        alert("Please select a department");
    }else if (departmentSelect.value === "add_new") {
        const newDepartment = prompt("Enter the name of the new department:");
        if (newDepartment) {
            addNewDepartment(newDepartment);
        }
    }else{
        let li=document.createElement("li");
        li.classList.add(prioritySelect.value);
        li.classList.add(departmentSelect.value);
        li.innerHTML = `<span class="date">${getFormattedDate()}</span><span class="task">${inputBox.value}</span><span class="department">${departmentSelect.value}</span><span class="cross">&times;</span>`;
        listContainer.appendChild(li);
        inputBox.value="";
        prioritySelect.value="";
        departmentSelect.value="";
        filterOptions.value="all";
        sortOptions.value="date-asc";
        modifyButtons.style.display = "none";
        saveData();
    }
        
}

inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

listContainer.addEventListener("click",function(e){
   
    if(e.target.tagName==="LI") {
        e.target.classList.toggle("checked");
        saveData();
        
    }
    else if(e.target.classList.contains("cross")){
        e.target.parentElement.remove();
            saveData();
    }
},false);

function getFormattedDate() {
    const now = new Date();
    const options = {year: 'numeric', month: 'short', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
}

function applyFilterSort() {
    const tasks = Array.from(listContainer.getElementsByTagName("li"));

    filterTasks(tasks);
    sortTasks(tasks);

    listContainer.innerHTML = "";
    for (let task of tasks) {
        listContainer.appendChild(task);
    }
    saveData();
}

function filterTasks(tasks) {
    const filterValue = filterOptions.value;

    for (let task of tasks) {
        task.style.display = ""; // Reset display property
        switch (filterValue) {
            case "all":
                break;
            case "priority":
                if(prioritySelect.value===""){
                    alert("Please select a priority!");
                }else if (!task.classList.contains(prioritySelect.value)) {
                    task.style.display = "none";
                }
                break;
            case "today":
                const taskDate = new Date(task.querySelector(".date").textContent);
                const today = new Date();
                if (taskDate.toDateString() !== today.toDateString()) {
                    task.style.display = "none";
                }
                break;
            case "department":
                if(departmentSelect.value===""){
                    alert("Please select a Department!");
                }else if(!task.classList.contains(departmentSelect.value)){
                    task.style.display="none";
                }
                break;
            case "completed":
                if (!task.classList.contains("checked")) {
                    task.style.display = "none";
                }
                break;
            case "uncompleted":
                if (task.classList.contains("checked")) {
                    task.style.display = "none";
                }
                break;
        }
    }
}

function sortTasks(tasks) {
    const sortValue = sortOptions.value;

    return tasks.sort((a, b) => {
        const dateA = new Date(a.querySelector(".date").textContent);
        const dateB = new Date(b.querySelector(".date").textContent);

        if (sortValue === "date-asc") {
            return dateA - dateB;
        } else if (sortValue === "date-desc") {
            return dateB - dateA;
        }
    });
}

function addNewDepartment(newDepartment){
    newDepartment = newDepartment.trim();
    // To Check if the department already exists
    if ([...departmentSelect.options].some(option => option.value === newDepartment)) {
        alert(`Department '${newDepartment}' already exists!`);
    } else {
        // Add new department option
        const option = document.createElement("option");
        option.value = newDepartment;
        option.textContent = newDepartment;
        departmentSelect.appendChild(option);

        // Select the newly added department
        departmentSelect.value = newDepartment;

        if (newDepartment !== "add_new")
            saveDepartments();
    }
}

function saveDepartments() {
    const departments = [...departmentSelect.options]
        .map(option => option.value.trim())
        .filter(value => value !== "" && value !== "add_new");
    localStorage.setItem("departments", JSON.stringify(departments));
    
}

// Function to load departments from localStorage
function loadDepartments() {
    const departments = JSON.parse(localStorage.getItem("departments")) || [];
    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentSelect.appendChild(option);
    });
    
}



departmentSelect.addEventListener("change", function () {
    selectedDepartment = departmentSelect.value;
    if (selectedDepartment !== "add_new") {
        modifyButtons.style.display = "block";
    } else {
        modifyButtons.style.display = "none";
        const newDepartment = prompt("Enter new department name:");
        if (newDepartment && newDepartment.trim() !== "") {
            const option = document.createElement("option");
            option.value = newDepartment.trim();
            option.text = newDepartment.trim();
            departmentSelect.add(option);
            saveDepartments();
        }
        departmentSelect.value = ""; // Reset selection to default
    }
});

function deleteDepartment() {
    if (confirm("Are you sure you want to delete this department?")) {
        for (let i = 0; i < departmentSelect.options.length; i++) {
            if (departmentSelect.options[i].value === selectedDepartment) {
                departmentSelect.remove(i);
                saveDepartments();
                break;
            }
        }
        modifyButtons.style.display = "none";
        selectedDepartment = null;
    }
}

function renameDepartment() {
    const newName = prompt("Enter new name for the department:", selectedDepartment);
    if (newName && newName.trim() !== "") {
        for (let i = 0; i < departmentSelect.options.length; i++) {
            if (departmentSelect.options[i].value === selectedDepartment) {
                departmentSelect.options[i].value = newName.trim();
                departmentSelect.options[i].text = newName.trim();
                saveDepartments();
                break;
            }
        }
        selectedDepartment = newName.trim();
    }
}


function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}
function showData(){
    listContainer.innerHTML=localStorage.getItem("data" || "");
    applyFilterSort();
}
function toggleThemes() {
    const themeOptions = document.querySelector('.theme-options');
    themeOptions.style.display = themeOptions.style.display === 'block' ? 'none' : 'block';
}

function collapseThemes() {
    const themeOptions = document.querySelector('.theme-options');
    themeOptions.style.display = 'none';
}

function changeTheme(theme) {
    const root = document.documentElement;
    switch (theme) {
        case 'theme2':
            document.documentElement.style.setProperty('--primary-color', '#A525C2');
            document.documentElement.style.setProperty('--secondary-color', 'black');
            document.documentElement.style.setProperty('--background-color', 'hsla(288, 12%, 48%, 0.947)');
            document.documentElement.style.setProperty('--button-color', '#A525C2');
            document.documentElement.style.setProperty('--hover-color', '#601b70');
            document.documentElement.style.setProperty('--text-color', 'black');
            document.documentElement.style.setProperty('--background-image', 'url("images/dark.png")');
            document.documentElement.style.setProperty('--icon-image','url("images/checked_dark.png")');
            break;
        case 'theme1':
            document.documentElement.style.setProperty('--primary-color', '#ff0077');
            document.documentElement.style.setProperty('--secondary-color', '#de0060');
            document.documentElement.style.setProperty('--background-color', 'hsla(339, 100%, 81%, 0.947)');
            document.documentElement.style.setProperty('--button-color', '#ff0077');
            document.documentElement.style.setProperty('--hover-color', '#ec0370');
            document.documentElement.style.setProperty('--text-color', '#670030');
            document.documentElement.style.setProperty('--background-image', 'url("images/bg.png")');
            document.documentElement.style.setProperty('--icon-image','url("images/check.png")');

            break;
        default:
            break;
    }
    localStorage.setItem('selectedTheme', theme);
    collapseThemes();
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        changeTheme(savedTheme);
    }
});

showData();
loadDepartments();

const apiKey = "fe35226c-9d14-4a2e-85db-8d49a8922db6";
const baseUrl = "https://js1-todo-api.vercel.app/api/todos";


document.addEventListener("DOMContentLoaded", fetchTodos);


const form = document.getElementById("todo-form");
form.addEventListener("submit", addTodo);


async function fetchTodos() {
    try {
        const response = await fetch(`${baseUrl}?apikey=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch todos");
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos.forEach((todo) => {
        const li = document.createElement("li");
        li.className = todo.completed ? "completed" : "";
        li.innerHTML = `
            ${todo.title}
            <div>
                <button onclick="toggleComplete('${todo._id}', ${todo.completed})">
                    ${todo.completed ? "Avmarkera" : "Klarmarkera"}
                </button>
                <button onclick="deleteTodo('${todo._id}', ${todo.completed})">Ta bort</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}


async function addTodo(event) {
    event.preventDefault();
    const input = document.getElementById("todo-input");
    const title = input.value.trim();

    if (!title) {
        alert("Du måste fylla i en todo!");
        return;
    }

    try {
        const response = await fetch(`${baseUrl}?apikey=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        if (!response.ok) throw new Error("Failed to add todo");
        input.value = ""; 
        fetchTodos(); 
    } catch (error) {
        console.error("Error:", error.message);
    }
}


async function deleteTodo(id, completed) {
    if (!completed) {
        showModal("Du kan bara ta bort klarmarkerade todos!");
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/${id}?apikey=${apiKey}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete todo");
        fetchTodos(); 
    } catch (error) {
        console.error("Error:", error.message);
    }
}


async function toggleComplete(id, currentStatus) {
    try {
        const response = await fetch(`${baseUrl}/${id}?apikey=${apiKey}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !currentStatus }),
        });
        if (!response.ok) throw new Error("Failed to update todo");
        fetchTodos(); 
    } catch (error) {
        console.error("Error:", error.message);
    }
}


function showModal(message) {
    const modal = document.getElementById("modal");
    modal.querySelector(".modal-body").textContent = message;
    modal.style.display = "block";
}

document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

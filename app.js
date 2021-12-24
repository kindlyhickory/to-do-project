(function() {

    const form = document.querySelector(".todo");
    
    
    function notifyAboutError(error) {
        alert(error.message)
    }
    
    async function getUsers() {
        try {
            const answer = await fetch("https://jsonplaceholder.typicode.com/users");
            const users = await answer.json();
            return users
            
        } catch (error) {
            notifyAboutError(error);
        }
    }
    
    async function getToDos() {
        try {
            const answer = await fetch("https://jsonplaceholder.typicode.com/todos");
            const todos = await answer.json();
            return todos
            
        } catch (error) {
            notifyAboutError(error);
        }
    }
    
    function todosToHtml(todos, users) {
        const list = document.querySelector(".todo__list");
        for (let todo of todos) {
            list.insertAdjacentHTML("afterbegin", `
            <li class="todo__item" data-id=${todo.id}>
                <label>
                    <input type="checkbox" name="done" class="todo__checkbox todo__invisible-checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo__visible-checkbox"></span>
                </label>    
                <p class="todo__text" value="${todo.title}">${todo.title}<span class="todo__span-accent"> task of ${getUserName(users, todo.userId)}</span></p>
                <button type="button" class="todo__close">
                </button>
            </li>
        `)}
        const checkoboxes = document.querySelectorAll(".todo__checkbox");
        const deleteButtons = document.querySelectorAll('.todo__close')
        
        for (let checkbox of checkoboxes) {
            checkbox.addEventListener('change', handleCheckBoxChange);
        }
    
        for (let deleteButton of deleteButtons) {
            deleteButton.addEventListener('click', handleDeleteClick);
        }
    }
    
    function usersToHtml(users) {
        const selectUser = document.querySelector(".todo__user")
        for (let user of users) {
            selectUser.insertAdjacentHTML('beforeend', `
            <option value=${user.id}>${user.name}</option>
            `)
        }
    }
    
    function getUserName(users, id) {
        for (let user of users) {
            if (user.id == id) {
                return user.name;
            }
        }
    }
    
    async function addToDo(todo) {
        try {
            const answer = await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                body: JSON.stringify(todo),
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
            
            const toAdd = await answer.json();
            Promise.all([getToDos(), getUsers()]).then(data => {
                [todos, users] = data;
                todosToHtml([toAdd], users);
            })
            
        } catch (error) {
            notifyAboutError(error);
        }
    }
    
    async function changeStatus(todoId, completed) {
        try {
            const answer = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
                method: "PATCH",
                body: JSON.stringify({completed: completed}),
                headers : {
                    'Content-Type' : 'application/json'
                }
            
            })
            const data = await answer.json();

            
        } catch (error) {
            notifyAboutError(error);
        }
    }
    
    async function deleteToDo(todoId) {
        try {
            const answer = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: "DELETE",
                headers : {
                    'Content-Type' : 'application/json'
                }
            })
            const data = await answer.json();
            if (answer.ok) {
                removeToDoFromHTML(todoId);
            }
            
        } catch (error) {
            notifyAboutError(error);
        }
    }
    
    function removeToDoFromHTML(todoId) {
        const todo = document.querySelector(`[data-id="${todoId}"]`)
        todo.querySelector('.todo__checkbox').removeEventListener('change', handleCheckBoxChange);
        todo.querySelector('.todo__close').removeEventListener('click', handleDeleteClick);
    
        todo.remove();
    }
    
    function handleDeleteClick() {
        const todoId = this.parentElement.dataset.id;
        return deleteToDo(todoId);
    }
    
    function handleCheckBoxChange() {
        const todoId = this.parentElement.dataset.id;
        const completed = this.checked;
    
        return changeStatus(todoId, completed);
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        const todoText = form.do.value;
        const user = form.user.value;
        const todo = {
            "userId": user,
            "title": todoText,
            "completed": false,
        }
        addToDo(todo);
    }
    
    function init() {
        Promise.all([getToDos(), getUsers()]).then(data => {
            [todos, users] = data;
            usersToHtml(users);
            todosToHtml(todos, users);
        })
    }
    
    document.addEventListener("DOMContentLoaded", init);
    form.addEventListener("submit", handleSubmit);

})();    


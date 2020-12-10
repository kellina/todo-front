// CRUD
//C - create
const createToDo = async(description) => {
    await fetch("http://localhost:8080/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({   //converte um objeto literal que tem só o description em Json
            description,
        }),
    });
};

//R - read
const getToDos = async() => { //Faz a consulta no banco
    resp = await fetch("http://localhost:8080/todo");
    const toDos = await resp.json();

    const ul = document.querySelector("ul");
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
    }

    toDos.forEach((todo) => {  //para desenhar os elementos li's na tela
        const li = document.createElement("li");
        li.innerHTML = `<input type="checkbox" ${todo.done? "checked" : ""} onclick='toggleToDo(${JSON.stringify(
      todo
    )})'> <span data-id="${todo.id}" data-checked="${todo.done}" class="description" contenteditable="true">${
      todo.description
    }</span><button class="btn" onclick="deleteToDo(${todo.id})"><i class="fa fa-trash-o"></i></button>`;
        ul.appendChild(li);
    });

    document.querySelectorAll(".description").forEach(todoEl => {
        todoEl.onkeydown = async(e) => { //para editar a descrição da tela e atualiza-la quando pressionar o enter
            if (e.key == "Enter") {
                e.preventDefault();
                //ele pega os 3 campos do todo no span para depois atualizar no updateTodo
                const id = e.target.getAttribute("data-id")
                const description = e.target.innerText
                const done = e.target.getAttribute("data-checked")
                updateToDo({ id, description, done })
                e.target.blur()
            }
        };
    });
};

//U - update
const updateToDo = async(todo) => {
    await fetch(`http://localhost:8080/todo/${todo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            description: todo.description,
            done: todo.done,
        }),
    });
};

const toggleToDo = async(todo) => {   //o toggle serve para alternar uma situação (marcar/desmarcar o done)
    await fetch(`http://localhost:8080/todo/${todo.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            description: todo.description,
            done: !todo.done,
        }),
    });

    getToDos();
};

//D - delete
const deleteToDo = async(id) => {
    await fetch(`http://localhost:8080/todo/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });
    await getToDos();
};

document.querySelector(".button").onclick = async(e) => {
    e.preventDefault(); //se clicar no botão, com o prevent ele não deve recarregar a página
    const inputTodo = document.querySelector("#todo");
    await createToDo(inputTodo.value);
    await getToDos(); //lista (atualizados) os todos que estão no banco
    inputTodo.value = ""; //limpa o input
};

getToDos(); //atualiza a tela.
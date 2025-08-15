const urlAPI = "http://localhost:3000/tarefas";


//Seleiona cada elemento do DOM presente na página HTML para manipulação posterior
//Aloca o valor que o usuario digitar no campo de input na variavel chamada inputTarefa



//Seleciona o botão de adicionar tarefa e aloca na variavel botaoAdicionar, que será utilizado para adicionar uma nova tarefa à lista
const botaoAdicionar = document.querySelector(".botao-adicionar");

const inputTarefa = document.querySelector(".campo-tarefa");
const inputDescricao = document.querySelector(".campo-descricao");
const inputStatus = document.querySelector(".campo-status");
const inputPrioridade = document.querySelector(".campo-prioridade");
const inputDataEntrega = document.querySelector(".campo-data-entrega");



//Seleciona a lista de tarefas e aloca na variavel listaTarefas, que será utilizada para exibir as tarefas adicionadas
//Essa lista será preenchida com as tarefas que forem adicionadas pelo usuário
const listaTarefas = document.querySelector(".lista-tarefas");

/*Função para carregar as tarefas adicionadas na tela */
async function renderizarTarefas() {
    try {
        const resposta = await fetch(apiURL);
        const tarefas = await resposta.json();

        tarefas.forEach(tarefa => {
            const itemLista = document.createElement("li");
            itemLista.className = "item-tarefa";
            itemLista.innerHTML = `
                <h2>${tarefa.titulo}</h2>
                <p>Status: ${tarefa.status} | Prioridade: ${tarefa.prioridade}</p>
                <p>Descrição: ${tarefa.descricao}</p>
                <p>Criada em: ${new Date(tarefa.data_criacao).toLocaleDateString()}</p>
                <p>Entrega: ${tarefa.data_entrega ? new Date(tarefa.data_entrega).toLocaleDateString() : 'Sem data de entrega'}</p>
            `;

            const botaoRemover = document.createElement("button");
            botaoRemover.className = "btn-remover";
            botaoRemover.textContent = "Excluir";
            botaoRemover.addEventListener("click", () => removerTarefa(tarefa.id));

            const botaoEditar = document.createElement("button");
            botaoEditar.className = "btn-editar";
            botaoEditar.textContent = "Editar";
            botaoEditar.addEventListener("click", () => editarTarefa(tarefa));

            itemLista.appendChild(botaoRemover);
            itemLista.appendChild(botaoEditar);
            listaTarefas.appendChild(itemLista);
        });
    } catch (erro) {
        console.error("Erro ao renderizar tarefas: ", erro);
    }
}





//Função para adicionar uma nova tarefa
async function adicionarTarefa(titulo) {

    listaTarefas.innerHTML = ""; // Limpa a lista de tarefas antes de renderizar novamente
    //Envia uma requisição POST para a API com o título da nova tarefa
    //A função fetch() é utilizada para fazer requisições HTTP
    //O método POST é utilizado para enviar dados ao servidor
    //O cabeçalho Content-Type é definido como application/json para indicar que estamos enviando
    //dados no formato JSON
    //O corpo da requisição contém os dados da nova tarefa em formato JSON

    try {
        await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ titulo: titulo }) // Por enquanto só enviamos o título
        });

        renderizarTarefas(); // Atualiza a lista de tarefas após adicionar uma nova

    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

async function editarTarefa(tarefa) {
    const novoTitulo = prompt("Editar título:", tarefa.titulo);
    const novaDescricao = prompt("Editar descrição:", tarefa.descricao);
    const novoStatus = prompt("Editar status:", tarefa.status);
    const novaPrioridade = prompt("Editar prioridade:", tarefa.prioridade);
    const novaDataEntrega = prompt("Editar data de entrega:", tarefa.data_entrega);

    const tarefaAtualizada = {
        titulo: novoTitulo || tarefa.titulo,
        descricao: novaDescricao || tarefa.descricao,
        status: novoStatus || tarefa.status,
        prioridade: novaPrioridade || tarefa.prioridade,
        data_entrega: novaDataEntrega || tarefa.data_entrega
    };

    try {
        await fetch(`${apiURL}/${tarefa.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarefaAtualizada)
        });

        renderizarTarefas(); // Atualiza a lista de tarefas após a edição
    } catch (erro) {
        console.error("Erro ao editar tarefa:", erro);
    }
}



//Função para remover uma tarefa
async function removerTarefa(id) {
    listaTarefas.innerHTML = ""; // Limpa a lista de tarefas antes de renderizar novamente
    try {
        await fetch(`${urlAPI}/${id}`, {
            method: "DELETE"
        });

        renderizarTarefas(); // Atualiza a lista de tarefas após remover uma tarefa

    } catch (erro) {
        console.error("Erro ao remover tarefa:", erro);
    }
}




botaoAdicionar.addEventListener("click", async (evento) => {
    evento.preventDefault();
    
    const titulo = inputTarefa.value.trim();
    const descricao = document.querySelector(".campo-descricao").value.trim();
    const status = document.querySelector(".campo-status").value;
    const prioridade = document.querySelector(".campo-prioridade").value;
    const dataEntrega = document.querySelector(".campo-data-entrega").value;

    if (titulo && status && prioridade) {
        const tarefa = {
            titulo,
            descricao,
            status,
            prioridade,
            data_entrega: dataEntrega || null
        };

        try {
            await fetch(apiURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarefa)
            });

            inputTarefa.value = "";
            document.querySelector(".campo-descricao").value = "";
            document.querySelector(".campo-status").value = "Pendente";
            document.querySelector(".campo-prioridade").value = "Média";
            document.querySelector(".campo-data-entrega").value = "";

            renderizarTarefas(); // Atualiza a lista de tarefas
        } catch (erro) {
            console.error("Erro ao adicionar tarefa:", erro);
        }
    }
});

        
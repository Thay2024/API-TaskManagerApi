const tarefaServices = require("../services/tarefaServices");

/*Função assimcrona para buscar todas as tarefas do banco de dados*/
async function listarTarefas(req, res) {
    try {
        const tarefas = await tarefaServices.listarQuery();
        // Verifica se há tarefas retornadas
        res.status(200).json(tarefas);
    } catch (error) {
        
        // Retorna um erro 500 se houver um problema com a consulta
        res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
    
}

async function criarTarefa(req, res) {
    try {
        const novaTarefa = await tarefaServices.criarQuery(req.body);
        res.status(201).json(novaTarefa);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
}

async function atualizarTarefa(req, res) {
    try {
        const tarefaAtualizada = await tarefaServices.atualizarQuery(req.params.id, req.body);
        if (!tarefaAtualizada) {
            res.status(200).json(tarefaAtualizada);
        }else{
            res.status(500).json({ error: 'Tarefa não encontrada' });
        }
        }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
}

async function deletarTarefa(req, res) {
    try {
        const tarefaRemovida = await tarefaServices.deletarQuery(req.params.id);
        if (!tarefaRemovida === 0) {
            res.status(404).json({erro: 'Tarefa não encontrada'});
        }else{
            res.status(204).json({ mensagem: 'Tarefa deletada com sucesso' });
        } 
    
    }
        
        catch (error) {
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
       
}


module.exports = { listarTarefas, criarTarefa, atualizarTarefa, deletarTarefa };
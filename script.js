const urlBase = 'http://159.65.228.63/';
let dados = [];

async function atualizar() {
    try {
        const response = await fetch(urlBase + 'tarefas');
        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }
        dados = await response.json();
        criarTabela(dados);
    } catch (error) {
        console.error('Erro:', error);
        dados = [];
        criarTabela([]);
    }
}

function criarTabela(tarefas) {
    const tbody = document.getElementById('tbody-tarefas');
    const mensagemVazia = document.getElementById('mensagem-vazia');
    const tabela = document.getElementById('tabela-tarefas');

    tbody.innerHTML = '';

    if (!tarefas || tarefas.length === 0) {
        mensagemVazia.style.display = 'block';
        tabela.style.display = 'none';
        return;
    }

    mensagemVazia.style.display = 'none';
    tabela.style.display = 'table';

    tarefas.forEach(tarefa => {
        const row = document.createElement('tr');
        
        const prioridade = tarefa.prioridade || tarefa.Prioridade || '';
        const tdPrioridade = document.createElement('td');
        tdPrioridade.textContent = prioridade || '-';
        
        if (prioridade === 'Urgente' || prioridade === 'urgente') {
            tdPrioridade.classList.add('prioridade-urgente');
        } else if (prioridade === 'Normal' || prioridade === 'normal') {
            tdPrioridade.classList.add('prioridade-normal');
        } else if (prioridade === 'Baixa' || prioridade === 'baixa') {
            tdPrioridade.classList.add('prioridade-baixa');
        }
        
        row.appendChild(tdPrioridade);

        const descricao = tarefa.descricao || tarefa.Descricao || tarefa.descriscao || tarefa.Descriscao || '';
        const tdDescricao = document.createElement('td');
        tdDescricao.textContent = descricao || 'Sem descrição';
        row.appendChild(tdDescricao);

        const local = tarefa.local || tarefa.Local || tarefa.localizacao || '';
        const tdLocal = document.createElement('td');
        tdLocal.textContent = local || '-';
        row.appendChild(tdLocal);

        const recursos = tarefa.recursosNecessarios || tarefa.RecursosNecessarios || tarefa.recursos || tarefa.Recursos || [];
        const tdRecursos = document.createElement('td');
        if (recursos && Array.isArray(recursos) && recursos.length > 0) {
            tdRecursos.textContent = recursos.join(', ');
        } else if (typeof recursos === 'string' && recursos.length > 0) {
            tdRecursos.textContent = recursos;
        } else {
            tdRecursos.textContent = 'Nenhum recurso';
        }
        row.appendChild(tdRecursos);

        const dataLimite = tarefa.dataLimite || tarefa.DataLimite || tarefa.data_limite || '';
        const tdDataLimite = document.createElement('td');
        if (dataLimite) {
            try {
                let dataStr = dataLimite.toString().trim();
                let data;
                
                if (dataStr.includes('T')) {
                    data = new Date(dataStr);
                } else if (dataStr.includes(' ')) {
                    let partes = dataStr.split(' ');
                    if (partes.length >= 2) {
                        let dataParte = partes[0];
                        let horaParte = partes[1];
                        
                        let [anoData, mesData, diaData] = dataParte.split('-');
                        let [hora, minuto, segundo] = horaParte.split(':');
                        
                        segundo = segundo || '00';
                        
                        data = new Date(parseInt(anoData), parseInt(mesData) - 1, parseInt(diaData), 
                                       parseInt(hora || '0'), parseInt(minuto || '0'), parseInt(segundo));
                    } else {
                        data = new Date(dataStr);
                    }
                } else {
                    data = new Date(dataStr);
                }
                
                if (!isNaN(data.getTime()) && data.getTime() > 0) {
                    const dia = String(data.getDate()).padStart(2, '0');
                    const mes = String(data.getMonth() + 1).padStart(2, '0');
                    const ano = data.getFullYear();
                    const horas = String(data.getHours()).padStart(2, '0');
                    const minutos = String(data.getMinutes()).padStart(2, '0');
                    tdDataLimite.textContent = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
                } else {
                    tdDataLimite.textContent = dataLimite;
                }
            } catch (e) {
                console.error('Erro ao formatar data:', e, dataLimite);
                tdDataLimite.textContent = dataLimite;
            }
        } else {
            tdDataLimite.textContent = 'Sem data';
        }
        row.appendChild(tdDataLimite);

        const matricula = tarefa.matricula || tarefa.Matricula || '';
        const tdMatricula = document.createElement('td');
        tdMatricula.textContent = matricula || '-';
        row.appendChild(tdMatricula);

        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', atualizar);

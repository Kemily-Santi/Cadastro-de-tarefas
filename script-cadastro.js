const urlBase = 'http://159.65.228.63/';
let recursosNecessarios = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-cadastro');
    const inputRecurso = document.getElementById('recurso-input');
    const btnAdicionarRecurso = document.getElementById('btn-adicionar-recurso');
    const listaRecursos = document.getElementById('lista-recursos');

    function adicionarRecurso() {
        const recurso = inputRecurso.value.trim();
        if (recurso) {
            recursosNecessarios.push(recurso);
            inputRecurso.value = '';
            atualizarListaRecursos();
        }
    }

    btnAdicionarRecurso.addEventListener('click', adicionarRecurso);

    inputRecurso.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarRecurso();
        }
    });

    function atualizarListaRecursos() {
        listaRecursos.innerHTML = '';
        recursosNecessarios.forEach((recurso, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${recurso}</span>
                <button type="button" class="btn-remover" data-index="${index}">Remover</button>
            `;
            listaRecursos.appendChild(li);
        });

        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                recursosNecessarios.splice(index, 1);
                atualizarListaRecursos();
            });
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const prioridade = document.getElementById('prioridade').value;
        const descricao = document.getElementById('descricao').value.trim();
        const local = document.getElementById('local').value.trim();
        const dataLimite = document.getElementById('dataLimite').value;
        const matricula = document.getElementById('matricula').value.trim();

        if (!prioridade) {
            alert('Por favor, selecione a prioridade');
            return;
        }

        if (!['Baixa', 'Normal', 'Urgente'].includes(prioridade)) {
            alert('Prioridade inválida. Use: Baixa, Normal ou Urgente');
            return;
        }

        if (!descricao) {
            alert('Por favor, preencha a descrição');
            document.getElementById('descricao').focus();
            return;
        }

        if (!local) {
            alert('Por favor, preencha o local');
            document.getElementById('local').focus();
            return;
        }

        if (!dataLimite) {
            alert('Por favor, selecione a data limite');
            document.getElementById('dataLimite').focus();
            return;
        }

        if (!matricula) {
            alert('Por favor, preencha a matrícula');
            document.getElementById('matricula').focus();
            return;
        }

        const dataObj = new Date(dataLimite);
        const ano = dataObj.getFullYear();
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const horas = String(dataObj.getHours()).padStart(2, '0');
        const minutos = String(dataObj.getMinutes()).padStart(2, '0');
        const segundos = String(dataObj.getSeconds()).padStart(2, '0');
        const dataFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

        const tarefa = {
            prioridade: prioridade,
            descricao: descricao,
            local: local,
            recursosNecessarios: recursosNecessarios,
            dataLimite: dataFormatada,
            matricula: parseInt(matricula)
        };

        try {
            const response = await fetch(urlBase + 'tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarefa)
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar tarefa');
            }

            alert('Tarefa salva com sucesso!');
            
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar tarefa. Por favor, tente novamente.');
        }
    });
});


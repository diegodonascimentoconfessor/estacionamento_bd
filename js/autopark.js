// Função para mostrar uma seção específica
function showSection(sectionId) {
    console.log(`Exibindo seção: ${sectionId}`);
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Função para adicionar uma linha a uma tabela
function addRowToTable(tableId, data) {
    console.log(`Adicionando dados à tabela ${tableId}:`, data);
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    data.forEach((value, index) => {
        const newCell = newRow.insertCell(index);
        newCell.textContent = value;
    });
    const actionCell = newRow.insertCell(data.length);
    actionCell.innerHTML = `
        <button onclick="editRow(this)">Editar</button>
        <button onclick="deleteRow(this)">Excluir</button>
    `;
}

// Função para lidar com o envio de formulário
async function submitForm(event, type) {
    event.preventDefault();
    console.log(`Formulário enviado: ${type}`);

    const form = document.getElementById(`${type}Form`);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log(`Dados do formulário:`, data);

    // Escolhe a função com base no tipo
    try {
        switch (type) {
            case 'veiculo':
                await handleVeiculoForm(data);
                break;
            case 'pagamento':
                await handlePagamentoForm(data);
                break;
            case 'busca':
                await handleBuscaForm(data);
                break;
            default:
                console.error('Tipo de formulário desconhecido:', type);
                break;
        }
    } catch (error) {
        console.error(`Erro ao enviar o formulário ${type}:`, error);
    }
}

// Função para lidar com o formulário de veículo
async function handleVeiculoForm(data) {
    console.log('Tratando formulário de veículo:', data);

    const response = await fetch('/veiculos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const result = await response.json();
        addRowToTable('veiculoTable', Object.values(result));
    } else {
        console.error('Erro ao enviar o formulário de veículo:', response.statusText);
    }
}

// Função para lidar com o formulário de pagamento
async function handlePagamentoForm(data) {
    console.log('Tratando formulário de pagamento:', data);

    const response = await fetch('/pagamentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById('resultadoPagamento').innerText = `Pagamento calculado: R$ ${result.valor}`;
    } else {
        console.error('Erro ao enviar o formulário de pagamento:', response.statusText);
    }
}

// Função para lidar com o formulário de busca
async function handleBuscaForm(data) {
    console.log('Tratando formulário de busca:', data);

    const response = await fetch(`/buscas/${data.placa}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById('resultadoBusca').innerText = `Veículo encontrado: ${JSON.stringify(result)}`;
    } else {
        console.error('Erro ao buscar o veículo:', response.statusText);
    }
}

// Função para editar uma linha na tabela
function editRow(button) {
    console.log(`Editando linha`);
    const row = button.closest('tr');
    const cells = row.getElementsByTagName('td');
    const formId = row.closest('table').id.replace('Table', 'Form');

    Array.from(cells).forEach((cell, index) => {
        if (index < cells.length - 1) {
            const input = document.getElementById(`${formId}${index}`);
            if (input) {
                input.value = cell.textContent;
                console.log(`Preenchendo ${input.id} com ${cell.textContent}`);
            }
        }
    });

    document.getElementById(`${formId}Id`).value = row.rowIndex;
    showSection(formId.replace('Form', ''));
}

// Função para excluir uma linha na tabela
async function deleteRow(button) {
    console.log(`Excluindo linha`);
    const row = button.closest('tr');
    const id = row.cells[0].textContent;
    const tableId = row.closest('table').id;
    const endpoint = `/${tableId.replace('Table', '')}/${id}`;

    console.log(`Endpoint de exclusão: ${endpoint}`);
    
    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Linha excluída com sucesso');
            row.remove();
        } else {
            console.error('Erro ao excluir a linha:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição de exclusão:', error);
    }
}

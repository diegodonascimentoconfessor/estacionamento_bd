const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'autopark',
    password: '123',
    port: 5432,
});

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

// Rotas para veículos
app.post('/veiculos', async (req, res) => {
    const { placa, modelo, cor, dataentrada } = req.body;
    const queryText = 'INSERT INTO veiculos (placa, modelo, cor, data_entrada) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [placa, modelo, cor, dataentrada];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao cadastrar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.get('/veiculos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM veiculos');
        res.json(result.rows);
    } catch (err) {
        res.status(400).send('Erro ao consultar veículos');
    }
});

app.put('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    const { placa, modelo, cor, dataentrada } = req.body;
    const queryText = 'UPDATE veiculos SET placa = $1, modelo = $2, cor = $3, data_entrada = $4 WHERE id = $5 RETURNING *';
    const values = [placa, modelo, cor, dataentrada, id];

    try {
        const result = await pool.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao editar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.delete('/veiculos/:id', async (req, res) => {
    const { id } = req.params;
    const queryText = 'DELETE FROM veiculos WHERE id = $1 RETURNING *';
    const values = [id];

    try {
        const result = await pool.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao deletar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

// Rotas para pagamentos
app.post('/pagamentos', async (req, res) => {
    const { veiculo_id, valor, data_saida } = req.body;
    const queryText = 'INSERT INTO pagamentos (veiculo_id, valor, data_saida) VALUES ($1, $2, $3) RETURNING *';
    const values = [veiculo_id, valor, data_saida];

    try {
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao registrar pagamento:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.get('/pagamentos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pagamentos');
        res.json(result.rows);
    } catch (err) {
        res.status(400).send('Erro ao consultar pagamentos');
    }
});

app.put('/pagamentos/:id', async (req, res) => {
    const { id } = req.params;
    const { veiculo_id, valor, data_saida } = req.body;
    const queryText = 'UPDATE pagamentos SET veiculo_id = $1, valor = $2, data_saida = $3 WHERE id = $4 RETURNING *';
    const values = [veiculo_id, valor, data_saida, id];

    try {
        const result = await pool.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao editar pagamento:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.delete('/pagamentos/:id', async (req, res) => {
    const { id } = req.params;
    const queryText = 'DELETE FROM pagamentos WHERE id = $1 RETURNING *';
    const values = [id];

    try {
        const result = await pool.query(queryText, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao deletar pagamento:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

// Rotas para buscas (simplificadas para consulta)
app.get('/buscas/:placa', async (req, res) => {
    const { placa } = req.params;
    const queryText = 'SELECT * FROM veiculos WHERE placa = $1';
    const values = [placa];

    try {
        const result = await pool.query(queryText, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar veículo:', err);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

app.listen(port, () => {
    console.log(`Servidor tá on! http://localhost:${port}`);
});

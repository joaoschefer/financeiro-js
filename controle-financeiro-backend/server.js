require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// Teste de conexão com o banco
pool.connect()
    .then(() => console.log("Conectado ao banco de dados"))
    .catch(err => console.error("Erro ao conectar ao banco:", err));

// Rota para adicionar uma transação
app.post("/transacao", async (req, res) => {
    let { descricao, valor, tipo } = req.body;

    if (!descricao || !valor || !["entrada", "saida"].includes(tipo)) {
        return res.status(400).json({ error: "Dados inválidos!" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO transacoes (descricao, valor, tipo, data) VALUES ($1, $2, $3, NOW()) RETURNING *",
            [descricao, parseFloat(valor), tipo]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao inserir transação:", error);
        res.status(500).json({ error: "Erro ao inserir transação" });
    }
});

// Rota para listar transações
app.get("/transacoes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM transacoes ORDER BY data DESC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar transações" });
    }
});

// Rota para obter saldo
app.get("/saldo", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END), 0) AS saldo FROM transacoes"
        );
        res.json({ saldo: result.rows[0].saldo });
    } catch (error) {
        res.status(500).json({ error: "Erro ao calcular saldo" });
    }
});

// Rota para excluir uma transação
app.delete("/transacoes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM transacoes WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }

        res.json({ mensagem: "Transação excluída com sucesso" });
    } catch (error) {
        console.error("Erro ao excluir transação:", error);
        res.status(500).json({ error: "Erro ao excluir transação" });
    }
});

// Rota para adicionar investimento
app.post('/investimentos', async (req, res) => {
    try {
        const { ativo, quantidade, valor_cota, tipo_investimento } = req.body;
        
        const query = `
            INSERT INTO investimentos (ativo, quantidade, valor_cota, tipo_investimento)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;

        const values = [ativo, quantidade, valor_cota, tipo_investimento];
        const result = await pool.query(query, values);
        
        res.status(201).json({ message: "Investimento cadastrado com sucesso!", data: result.rows[0] });
    } catch (error) {
        console.error("Erro ao inserir no banco:", error);
        res.status(500).json({ error: "Erro ao salvar investimento" });
    }
});

// Iniciar o servidor na porta correta
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

// rota para adicionar transacao
app.post("/transacoes", async (req, res) => {
    const { descricao, tipo, valor, data } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO transacoes (descricao, tipo, valor, data) VALUES ($1, $2, $3, $4) RETURNING *",
            [descricao, tipo, valor, data]
        );
        res.status(201).json(result.rows[0]); // Retorna a transação criada
    } catch (error) {
        console.error("Erro ao inserir transação:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// rota para adicionar investimento
app.post("/investimentos", async (req, res) => {
    const { ativo, quantidade, valor_cota, tipo_investimento } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO investimentos (ativo, quantidade, valor_cota, tipo_investimento, data_investimento) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
            [ativo, quantidade, valor_cota, tipo_investimento]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao inserir investimento:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get("/investimentos/total", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COALESCE(SUM(quantidade * valor_cota), 0) AS total_investido FROM investimentos"
        );

        const total = parseFloat(result.rows[0].total_investido).toFixed(2); // Converter para número

        res.json({ total });
    } catch (error) {
        console.error("Erro ao calcular total investido:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// rota para saldo, ganhos e gastos
app.get("/financeiro/saldo", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS total_ganhos,
                COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS total_gastos
            FROM transacoes
        `);

        const ganhos = parseFloat(result.rows[0].total_ganhos);
        const gastos = parseFloat(result.rows[0].total_gastos);
        const saldo = ganhos - gastos;

        res.json({ saldo: saldo.toFixed(2), ganhos: ganhos.toFixed(2), gastos: gastos.toFixed(2) });
    } catch (error) {
        console.error("Erro ao calcular saldo:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// rota para obter as 5 ultimas transacoes
app.get("/transacoes/ultimas", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT descricao, tipo, valor, data FROM transacoes ORDER BY data DESC LIMIT 5"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar as últimas transações:", error);
        res.status(500).json({ error: "Erroi interno do servidor" });
    }
});

// rota para obter os ultimos 5 investimentos
app.get("/investimentos/ultimos", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT ativo, quantidade, valor_cota, tipo_investimento, data_investimento FROM investimentos ORDER BY data_investimento DESC LIMIT 5"
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar últimos investimentos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

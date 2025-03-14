# 📊 Dashboard Financeiro

Este projeto foi desenvolvido para uso próprio e como um meio de estudo. Ele permite o cadastro de transações financeiras (gastos e ganhos) e investimentos, ajudando no controle financeiro pessoal.

## 🚀 Tecnologias Utilizadas

- **Frontend:** HTML, CSS e JavaScript (sem frameworks)
- **Banco de Dados:** PostgreSQL

## 📦 Configuração e Instalação

### 🔧 Pré-requisitos
Antes de executar o projeto, certifique-se de ter instalado:

- PostgreSQL
- Node.js (caso precise rodar scripts adicionais)

### 📥 Configuração do Banco de Dados

1. Configure o banco de dados PostgreSQL.
2. No arquivo `.env`, forneça as credenciais de acesso ao banco.
3. O banco de dados deve ter o nome `controle_financeiro`.
4. Estrutura das tabelas:

   **Tabela `investimentos`**
   - `id` (INTEGER, chave primária)
   - `ativo` (TEXT) - Nome do ativo investido
   - `quantidade` (INTEGER) - Quantidade adquirida
   - `valor_cota` (DECIMAL) - Preço por cota
   - `tipo_investimento` (TEXT) - Tipo do investimento (ex: ações, fundos, etc.)
   - `data_investimento` (DATE) - Data da aquisição

   **Tabela `transacoes`**
   - `id` (INTEGER, chave primária)
   - `descricao` (TEXT) - Descrição da transação
   - `valor` (DECIMAL) - Valor da transação
   - `tipo` (TEXT) - Tipo da transação (gasto ou ganho)
   - `data` (DATE) - Data da transação

## ▶️ Como Usar

1. Configure o banco de dados conforme as instruções acima.
2. Certifique-se de que as variáveis de ambiente no `.env` estão corretamente definidas.
3. Execute o projeto localmente utilizando um servidor local ou abrindo o arquivo HTML no navegador.

---
Caso tenha dúvidas ou queira contribuir, fique à vontade para entrar em contato! 🚀


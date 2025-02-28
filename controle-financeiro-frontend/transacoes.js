document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "http://localhost:3005"; // Alterar se necessário

    let saldoValor = document.getElementById("saldo-valor");
    let tabelaTransacoes = document.getElementById("tabela-transacoes");

    async function carregarDados() {
        await carregarTransacoes();
        await carregarSaldo();
    }

    async function carregarTransacoes() {
        try {
            const response = await fetch(`${API_URL}/transacoes`);
            const transacoes = await response.json();

            tabelaTransacoes.innerHTML = ""; // Limpa a tabela antes de adicionar novas linhas

            transacoes.forEach(transacao => {
                let linha = document.createElement("tr");

                let fluxo = transacao.tipo.toLowerCase().trim() === "entrada" ? "Entrada" : "Saída";
                let dataHora = new Date(transacao.data);
                let dataFormatada = dataHora.toLocaleDateString("pt-BR");
                let horaFormatada = dataHora.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

                linha.innerHTML = `
                    <td>${transacao.descricao}</td>
                    <td>${fluxo}</td>
                    <td>R$ ${parseFloat(transacao.valor).toFixed(2)}</td>
                    <td>${dataFormatada} às ${horaFormatada}</td>
                    <td>
                        <button class="botao excluir" onclick="excluirTransacao('${transacao.id}')">Excluir</button>
                    </td>
                `;

                tabelaTransacoes.appendChild(linha);
            });

        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        }
    }

    async function carregarSaldo() {
        try {
            const response = await fetch(`${API_URL}/saldo`);
            const data = await response.json();
            saldoValor.textContent = `R$ ${parseFloat(data.saldo).toFixed(2)}`;
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    }

    // 📌 Função para excluir transação
    window.excluirTransacao = async function (id) {
        if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

        try {
            await fetch(`${API_URL}/transacoes/${id}`, {
                method: "DELETE"
            });

            alert("Transação excluída com sucesso!");
            carregarDados();
        } catch (error) {
            console.error("Erro ao excluir transação:", error);
        }
    };

    carregarDados();
});

document.addEventListener("DOMContentLoaded", function() {
    async function carregarTodasTransacoes() {
        try {
            const response = await fetch("http://localhost:3005/transacoes");
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const transacoes = await response.json();
            const tabelaTransacoes = document.getElementById("tabela-transacoes");

            tabelaTransacoes.innerHTML = "";

            transacoes.forEach(transacao => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${transacao.descricao}</td>
                    <td>${transacao.tipo === "entrada" ? "Entrada" : "Saída"}</td>
                    <td>R$ ${parseFloat(transacao.valor).toFixed(2)}</td>
                    <td>${new Date(transacao.data).toLocaleDateString("pt-BR")}</td>
                `;
                tabelaTransacoes.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        }
    }

    carregarTodasTransacoes();
});
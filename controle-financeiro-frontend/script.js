document.addEventListener("DOMContentLoaded", function () {
    let formTransacao = document.getElementById("form-transacao");
    let saldoValor = document.getElementById("saldo-valor");

    const API_URL = "http://localhost:3005"; // Alterar se rodar em outro servidor

    async function carregarSaldo() {
        try {
            const response = await fetch(`${API_URL}/saldo`);
            const data = await response.json();
            saldoValor.textContent = `R$ ${parseFloat(data.saldo).toFixed(2)}`;
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    }

    formTransacao.addEventListener("submit", async function (event) {
        event.preventDefault();

        let descricao = document.getElementById("descricao").value;
        let valor = document.getElementById("valor").value.replace(",", "."); // Substitui vírgula por ponto
        let tipo = document.getElementById("tipo").value;

        valor = parseFloat(valor);

        if (!descricao || isNaN(valor)) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/transacao`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ descricao, valor, tipo })
            });

            if (!response.ok) {
                throw new Error("Erro ao adicionar transação");
            }

            await carregarSaldo();
            formTransacao.reset();

            mensagem.textContent = `Transação "${descricao}" adicionada com sucesso!`;
            mensagem.style.display = "block";

            setTimeout(() => {
                mensagem.style.display = "none";
            }, 3005);
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar transação.");
        }
    });

    carregarSaldo();
});

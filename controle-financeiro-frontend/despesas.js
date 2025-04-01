if (formTransacao) {
    formTransacao.addEventListener("submit", async function (event) {
        event.preventDefault();

        const descricao = document.getElementById("descricao").value;
        const tipo = document.getElementById("tipo").value;
        const valor = parseFloat(document.getElementById("valor").value);
        const data = document.getElementById("data").value;

        const novaTransacao = {
            descricao,
            tipo,
            valor,
            data,
        };

        try {
            const response = await fetch("http://localhost:3005/transacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novaTransacao),
            });

            if (response.ok) {
                alert("Transação adicionada com sucesso!");
                formTransacao.reset();
                modalTransacao.style.display = "none";
            } else {
                alert("Erro ao adicionar transação");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
        }
    });
}
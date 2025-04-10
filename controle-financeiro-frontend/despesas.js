document.addEventListener("DOMContentLoaded", function() {

    const links = document.querySelectorAll('.sidebar ul li a');
    const currentPage = window.location.pathname.split('/').pop(); 

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }
    });

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
                    <td><button class="btn-excluir" data-id="${transacao.id}">Excluir</button></td>
                `;
                tabelaTransacoes.appendChild(linha);
            });

            adicionarEventosExclusao();
            gerarGraficoPizza(transacoes);
            gerarGraficoBarras(transacoes);

        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        }
    }

    function adicionarEventosExclusao() {
        document.querySelectorAll(".btn-excluir").forEach(botao => {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                const confirmar = confirm("Tem certeza que deseja excluir esta transação?");
                if (!confirmar) return;

                try {
                    const resposta = await fetch(`http://localhost:3005/transacoes/${id}`, {
                        method: "DELETE"
                    });

                    if (resposta.ok) {
                        carregarTodasTransacoes(); // Recarrega a tabela
                    } else {
                        alert("Erro ao excluir transação.");
                    }
                } catch (erro) {
                    console.error("Erro ao excluir transação:", erro);
                }
            });
        });
    }

    async function gerarGraficoPizza(transacoes) {
        const totalEntrada = transacoes
            .filter(t => t.tipo === "entrada")
            .reduce((acc, t) => acc + parseFloat(t.valor), 0);

        const totalSaida = transacoes
            .filter(t => t.tipo === "saida")
            .reduce((acc, t) => acc + parseFloat(t.valor), 0);

        const ctx = document.getElementById("graficoPizza").getContext("2d");

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Entradas', 'Saídas'],
                datasets: [{
                    data: [totalEntrada, totalSaida],
                    backgroundColor: ['#4caf50', '#e74c3c'],
                }]
            }
        });
    }

    function gerarGraficoBarras(transacoes) {
        const dadosPorMes = {};

        transacoes.forEach(t => {
            const data = new Date(t.data);
            const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

            if (!dadosPorMes[mesAno]) {
                dadosPorMes[mesAno] = {entrada: 0, saida: 0};
            }

            if (t.tipo === "entrada") {
                dadosPorMes[mesAno].entrada += parseFloat(t.valor);
            } else if (t.tipo === "saida") {
                dadosPorMes[mesAno].saida += parseFloat(t.valor);
            }
        });

        const meses = Object.keys(dadosPorMes).sort((a, b) => {
            const [mesA, anoA] = a.split('/').map(Number);
            const [mesB, anoB] = b.split('/').map(Number);
            return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
        });

        const entradas = meses.map(mes => dadosPorMes[mes].entrada);
        const saidas = meses.map(mes => dadosPorMes[mes].saida);

        const ctx = document.getElementById("graficoBarras").getContext("2d");

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [
                    {
                        label: 'Entradas',
                        data: entradas,
                        backgroundColor: '#4caf50'
                    },
                    {
                        label: 'Saídas',
                        data: saidas,
                        backgroundColor: '#e74c3c'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Inicia carregamento
    carregarTodasTransacoes();
});

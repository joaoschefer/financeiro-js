document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.sidebar ul li a');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }
    });

    // Botões de troca de tabela
    const botoesTabela = document.querySelectorAll('.tabela-btn');
    const tabelas = document.querySelectorAll('.tabela-wrapper');

    botoesTabela.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesTabela.forEach(b => b.classList.remove('active'));
            botao.classList.add('active');

            const alvo = botao.getAttribute('data-target');
            tabelas.forEach(tabela => {
                if (tabela.id === alvo) {
                    tabela.classList.remove('hidden');
                } else {
                    tabela.classList.add('hidden');
                }
            });
        });
    });

    // Modal Transação
    const modalTransacao = document.getElementById("modal-transacao");
    const abrirModalTransacao = document.getElementById("abrir-modal-transacao");
    const fecharModalTransacao = document.querySelector(".fechar-modal-transacao");
    const formTransacao = document.getElementById("form-transacao");

    if (abrirModalTransacao && modalTransacao) {
        abrirModalTransacao.addEventListener("click", () => {
            modalTransacao.style.display = "flex";
        });
    }

    if (fecharModalTransacao && modalTransacao) {
        fecharModalTransacao.addEventListener("click", () => {
            modalTransacao.style.display = "none";
        });
    }

    if (formTransacao) {
        formTransacao.addEventListener("submit", async function (event) {
            event.preventDefault();
            const descricao = document.getElementById("descricao").value;
            const tipo = document.getElementById("tipo").value;
            const valor = parseFloat(document.getElementById("valor").value);
            const data = document.getElementById("data").value;

            const novaTransacao = { descricao, tipo, valor, data };

            try {
                const response = await fetch("http://localhost:3005/transacoes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(novaTransacao),
                });

                if (response.ok) {
                    alert("Transação adicionada com sucesso!");
                    formTransacao.reset();
                    modalTransacao.style.display = "none";
                    carregarUltimasTransacoes();
                    carregarSaldo();
                } else {
                    alert("Erro ao adicionar transação");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
            }
        });
    }

    // Modal Investimento
    const modalInvestimento = document.getElementById("modal-investimento");
    const abrirModalInvestimento = document.getElementById("abrir-modal-investimento");
    const fecharModalInvestimento = document.querySelector(".fechar-modal-investimento");
    const formInvestimento = document.getElementById("form-investimento");

    if (abrirModalInvestimento && modalInvestimento) {
        abrirModalInvestimento.addEventListener("click", () => {
            modalInvestimento.style.display = "flex";
        });
    }

    if (fecharModalInvestimento && modalInvestimento) {
        fecharModalInvestimento.addEventListener("click", () => {
            modalInvestimento.style.display = "none";
        });
    }

    if (formInvestimento) {
        formInvestimento.addEventListener("submit", async function (event) {
            event.preventDefault();
            const ativo = document.getElementById("ativo").value;
            const quantidade = parseFloat(document.getElementById("quantidade").value);
            const valor_cota = parseFloat(document.getElementById("valor-cota").value);
            const tipo_investimento = document.getElementById("tipo-investimento").value;

            const novoInvestimento = { ativo, quantidade, valor_cota, tipo_investimento };

            try {
                const response = await fetch("http://localhost:3005/investimentos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(novoInvestimento),
                });

                if (response.ok) {
                    alert("Investimento adicionado com sucesso!");
                    formInvestimento.reset();
                    modalInvestimento.style.display = "none";
                    carregarUltimosInvestimentos();
                    carregarTotalInvestido();
                } else {
                    alert("Erro ao adicionar investimento");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
            }
        });
    }

    async function carregarTotalInvestido() {
        try {
            const response = await fetch("http://localhost:3005/investimentos/total");
            const data = await response.json();
            const totalInvestido = parseFloat(data.total).toFixed(2);
            const totalEl = document.getElementById("total-investimentos");
            if (totalEl) totalEl.innerText = `R$ ${totalInvestido}`;
        } catch (error) {
            console.error("Erro ao carregar total investido:", error);
        }
    }

    async function carregarSaldo() {
        try {
            const response = await fetch("http://localhost:3005/financeiro/saldo");
            const data = await response.json();
            document.getElementById("saldo").innerText = `R$ ${parseFloat(data.saldo).toFixed(2)}`;
            document.getElementById("ganhos").innerText = `R$ ${parseFloat(data.ganhos).toFixed(2)}`;
            document.getElementById("gastos").innerText = `R$ ${parseFloat(data.gastos).toFixed(2)}`;
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    }

    async function carregarUltimasTransacoes() {
        try {
            const response = await fetch("http://localhost:3005/transacoes/ultimas");
            const transacoes = await response.json();
            const tabela = document.getElementById("tabela-transacoes");
            tabela.innerHTML = "";
            transacoes.forEach(transacao => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${transacao.descricao}</td>
                    <td>${transacao.tipo === "entrada" ? "Entrada" : "Saída"}</td>
                    <td>R$ ${parseFloat(transacao.valor).toFixed(2)}</td>
                    <td>${new Date(transacao.data).toLocaleDateString("pt-BR")}</td>
                `;
                tabela.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar transações:", error);
        }
    }

    async function carregarUltimosInvestimentos() {
        try {
            const response = await fetch("http://localhost:3005/investimentos/ultimos");
            const investimentos = await response.json();
            const tabela = document.getElementById("tabela-investimentos");
            tabela.innerHTML = "";
            investimentos.forEach(inv => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${inv.ativo}</td>
                    <td>${inv.quantidade}</td>
                    <td>R$ ${parseFloat(inv.valor_cota).toFixed(2)}</td>
                    <td>${inv.tipo_investimento === "acao" ? "Ação" : "Fundo Imobiliário"}</td>
                    <td>${new Date(inv.data_investimento).toLocaleDateString("pt-BR")}</td>
                `;
                tabela.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar investimentos:", error);
        }
    }

    // Iniciar carregamento
    carregarTotalInvestido();
    carregarSaldo();
    carregarUltimasTransacoes();
    carregarUltimosInvestimentos();
});

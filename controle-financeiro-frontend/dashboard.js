document.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll('.sidebar ul li a');
    const currentPage = window.location.pathname.split('/').pop(); 

    links.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }
    });

    // modal de transações
    const modalTransacao = document.getElementById("modal-transacao");
    const abrirModalTransacao = document.getElementById("abrir-modal-transacao");
    const fecharModalTransacao = document.querySelector(".fechar-modal-transacao");
    const formTransacao = document.getElementById("form-transacao");

    // modal de investimentos
    const modalInvestimento = document.getElementById("modal-investimento");
    const abrirModalInvestimento = document.getElementById("abrir-modal-investimento");
    const fecharModalInvestimento = document.querySelector(".fechar-modal-investimento");
    const formInvestimento = document.getElementById("form-investimento");

    if (abrirModalTransacao && modalTransacao) {
        abrirModalTransacao.addEventListener("click", function () {
            modalTransacao.style.display = "flex";
        });
    }

    if (fecharModalTransacao && modalTransacao) {
        fecharModalTransacao.addEventListener("click", function () {
            modalTransacao.style.display = "none";
        });
    }

    if (abrirModalInvestimento && modalInvestimento) {
        abrirModalInvestimento.addEventListener("click", function () {
            modalInvestimento.style.display = "flex";
        });
    }

    if (fecharModalInvestimento && modalInvestimento) {
        fecharModalInvestimento.addEventListener("click", function () {
            modalInvestimento.style.display = "none";
        });
    }

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

    if (formInvestimento) {
        formInvestimento.addEventListener("submit", async function (event) {
            event.preventDefault();

            const ativo = document.getElementById("ativo").value;
            const quantidade = parseFloat(document.getElementById("quantidade").value);
            const valor_cota = parseFloat(document.getElementById("valor-cota").value);
            const tipo_investimento = document.getElementById("tipo-investimento").value;

            const novoInvestimento = {
                ativo,
                quantidade,
                valor_cota,
                tipo_investimento,
            };

            try {
                const response = await fetch("http://localhost:3005/investimentos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(novoInvestimento),
                });

                if (response.ok) {
                    alert("Investimento adicionado com sucesso!");
                    formInvestimento.reset();
                    modalInvestimento.style.display = "none";

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
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            const totalInvestido = parseFloat(data.total).toFixed(2); 

            console.log("Total investido recebido:", totalInvestido); 

            const totalInvestimentosEl = document.getElementById("total-investimentos");

            if (totalInvestimentosEl) {
                totalInvestimentosEl.innerText = `R$ ${totalInvestido}`;
                console.log("Elemento atualizado com sucesso!"); 
            } else {
                console.error("Elemento #total-investimentos não encontrado no DOM.");
            }
        } catch (error) {
            console.error("Erro ao carregar total investido:", error);
        }
    }

    async function carregarSaldo(){
        try {
            const response = await fetch("http://localhost:3005/financeiro/saldo");
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            const saldo = parseFloat(data.saldo).toFixed(2);
            const ganhos = parseFloat(data.ganhos).toFixed(2);
            const gastos = parseFloat(data.gastos).toFixed(2);

            document.getElementById("saldo").innerText = `R$ ${saldo}`;
            document.getElementById("ganhos").innerText = `R$ ${ganhos}`;
            document.getElementById("gastos").innerText = `R$ ${gastos}`;
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    }

    async function carregarUltimasTransacoes() {
        try {
            const response = await fetch("http://localhost:3005/transacoes/ultimas");
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
            console.error("Erro ao carregar últimas transações:", error);
        }
    }

    async function carregarUltimosInvestimentos(){
        try {
            const response = await fetch("http://localhost:3005/investimentos/ultimos");
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const investimentos = await response.json();
            const tabelaInvestimentos = document.getElementById("tabela-investimentos");

            tabelaInvestimentos.innerHTML = "";

            investimentos.forEach(investimento => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${investimento.ativo}</td>
                    <td>${investimento.quantidade}</td>
                    <td>R$ ${parseFloat(investimento.valor_cota).toFixed(2)}</td>
                    <td>${investimento.tipo_investimento === "acao" ? "Ação" : "Fundo Imobiliário"}</td>
                    <td>${new Date(investimento.data_investimento).toLocaleDateString("pt-BR")}</td>
                `;
                tabelaInvestimentos.appendChild(linha);
            });
        } catch (error) {
            console.error("Erro ao carregar últimos investimentos:", error);
        }
    }

    // chamar as funções ao carregar a página
    carregarTotalInvestido();
    carregarSaldo();
    carregarUltimasTransacoes();
    carregarUltimosInvestimentos();
});


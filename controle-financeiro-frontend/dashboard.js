document.addEventListener("DOMContentLoaded", function () {
    // Modal de Transações
    const modalTransacao = document.getElementById("modal-transacao");
    const abrirModalTransacao = document.getElementById("abrir-modal-transacao");
    const fecharModalTransacao = document.querySelector(".fechar-modal-transacao");
    const formTransacao = document.getElementById("form-transacao");

    // Modal de Investimentos
    const modalInvestimento = document.getElementById("modal-investimento");
    const abrirModalInvestimento = document.getElementById("abrir-modal-investimento");
    const fecharModalInvestimento = document.querySelector(".fechar-modal-investimento");
    const formInvestimento = document.getElementById("form-investimento");

    // Abrir modal de transações
    if (abrirModalTransacao && modalTransacao) {
        abrirModalTransacao.addEventListener("click", function () {
            modalTransacao.style.display = "flex";
        });
    }

    // Fechar modal de transações
    if (fecharModalTransacao && modalTransacao) {
        fecharModalTransacao.addEventListener("click", function () {
            modalTransacao.style.display = "none";
        });
    }

    // Abrir modal de investimentos
    if (abrirModalInvestimento && modalInvestimento) {
        abrirModalInvestimento.addEventListener("click", function () {
            modalInvestimento.style.display = "flex";
        });
    }

    // Fechar modal de investimentos
    if (fecharModalInvestimento && modalInvestimento) {
        fecharModalInvestimento.addEventListener("click", function () {
            modalInvestimento.style.display = "none";
        });
    }

    // Capturar e enviar dados do formulário de transações
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

    // Capturar e enviar dados do formulário de investimentos
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

                    // Atualizar o total investido após adicionar um investimento
                    carregarTotalInvestido();
                } else {
                    alert("Erro ao adicionar investimento");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
            }
        });
    }

    // Função para carregar o total investido
    async function carregarTotalInvestido() {
        try {
            const response = await fetch("http://localhost:3005/investimentos/total");
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const data = await response.json();
            const totalInvestido = parseFloat(data.total).toFixed(2); // Converter para número e formatar

            console.log("Total investido recebido:", totalInvestido); // Debug no console

            const totalInvestimentosEl = document.getElementById("total-investimentos");

            if (totalInvestimentosEl) {
                totalInvestimentosEl.innerText = `Investimentos: R$ ${totalInvestido}`;
                console.log("Elemento atualizado com sucesso!"); // Debug
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

            document.getElementById("saldo").innerText = `Saldo: R$ ${saldo}`;
            document.getElementById("ganhos").innerText = `Ganhos: R$ ${ganhos}`;
            document.getElementById("gastos").innerText = `Gastos: R$ ${gastos}`;
        } catch (error) {
            console.error("Erro ao carregar saldo:", error);
        }
    }

    // Chamar as funções ao carregar a página
    carregarTotalInvestido();
    carregarSaldo();

});

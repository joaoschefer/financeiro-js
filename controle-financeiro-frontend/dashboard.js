document.addEventListener("DOMContentLoaded", function() {
    // Modal de Transações
    const modalTransacao = document.getElementById("modal");
    const abrirModalTransacao = document.getElementById("abrir-modal");
    const fecharModalTransacao = document.querySelector(".fechar-modal");

    // Modal de Investimentos
    const modalInvestimento = document.getElementById("modal-investimento");
    const abrirModalInvestimento = document.getElementById("abrir-modal-investimento");
    const fecharModalInvestimento = document.querySelector(".fechar-modal-investimento");

    // Verificação no console
    console.log("Botão de Transação:", abrirModalTransacao);
    console.log("Botão de Investimento:", abrirModalInvestimento);
    console.log("Modal de Transação:", modalTransacao);
    console.log("Modal de Investimento:", modalInvestimento);

    if (abrirModalTransacao && modalTransacao) {
        abrirModalTransacao.addEventListener("click", function() {
            modalTransacao.style.display = "flex";
        });
    }

    if (fecharModalTransacao && modalTransacao) {
        fecharModalTransacao.addEventListener("click", function() {
            modalTransacao.style.display = "none";
        });
    }

    if (abrirModalInvestimento && modalInvestimento) {
        abrirModalInvestimento.addEventListener("click", function() {
            modalInvestimento.style.display = "flex";
        });
    } else {
        console.warn("Botão ou Modal de Investimento não encontrado!");
    }

    if (fecharModalInvestimento && modalInvestimento) {
        fecharModalInvestimento.addEventListener("click", function() {
            modalInvestimento.style.display = "none";
        });
    } else {
        console.warn("Botão de fechar modal de Investimento não encontrado!");
    }
});

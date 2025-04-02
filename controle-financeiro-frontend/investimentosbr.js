document.addEventListener("DOMContentLoaded", function () {
  // Carregar o total investido
  async function carregarTotalInvestido() {
      try {
          const response = await fetch("http://localhost:3005/investimentos/total");
          if (!response.ok) {
              throw new Error(`Erro na API: ${response.status}`);
          }

          const data = await response.json();
          const totalInvestido = parseFloat(data.total).toFixed(2);

          document.getElementById("total-investido").innerText = `Total Investido: R$ ${totalInvestido}`;
      } catch (error) {
          console.error("Erro ao carregar total investido:", error);
      }
  }

  // Carregar todos os investimentos
  async function carregarTodosInvestimentos() {
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
          console.error("Erro ao carregar investimentos:", error);
      }

  }

  // Chamar as funções ao carregar a página
  carregarTotalInvestido();
  carregarTodosInvestimentos();
});

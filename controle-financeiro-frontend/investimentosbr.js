// Gráfico de Pizza – Distribuição por Tipo de Ativo
const ctx = document.getElementById('graficoPizza').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Ações', 'FIIs', 'Tesouro Direto'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: ['#007bff', '#28a745', '#ffc107'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Gráfico de Linha – Evolução da Carteira
const ctxLinha = document.getElementById('graficoLinha').getContext('2d');
new Chart(ctxLinha, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Valor da Carteira (R$)',
      data: [1000, 1200, 1350, 1500, 1700, 1850],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});

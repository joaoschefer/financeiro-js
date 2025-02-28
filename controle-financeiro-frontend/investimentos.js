document.getElementById('form-investimento').addEventListener('submit', async function(event) {
    event.preventDefault();

    const ativo = document.getElementById('ativo').value;
    const quantidade = document.getElementById('quantidade').value;
    const valorCota = document.getElementById('valor-cota').value;
    const tipoInvestimento = document.getElementById('tipo-investimento').value;

    const dados = {
        ativo,
        quantidade: parseFloat(quantidade),
        valor_cota: parseFloat(valorCota),
        tipo_investimento: tipoInvestimento
    };

    try {
        const resposta = await fetch('http://localhost:3005/investimentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();
        alert(resultado.message);

        // Limpar formulário
        document.getElementById('form-investimento').reset();
    } catch (error) {
        console.error("Erro ao cadastrar investimento:", error);
        alert("Erro ao cadastrar investimento.");
    }
});

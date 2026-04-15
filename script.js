const formatoEuro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatoNumero = new Intl.NumberFormat('pt-PT');

// Variável para guardar a memória do gráfico
let graficoCircular;

// Função para mudar de separador no Dashboard
function mudarSeparador(idSeparador, elementoBotao) {
    // 1. Esconde todos os separadores
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    // 2. Tira a cor azul de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // 3. Mostra o separador que clicaste e pinta o botão de azul
    document.getElementById(idSeparador).style.display = 'block';
    elementoBotao.classList.add('active');
}

function calcular() {
    let quartos = parseFloat(document.getElementById("quartos").value) || 0;
    let ocupacao = parseFloat(document.getElementById("ocupacao").value) || 0;
    let capital = parseFloat(document.getElementById("capital").value) || 0;
    let roe = parseFloat(document.getElementById("roe").value) || 0;
    let irc = parseFloat(document.getElementById("irc").value) || 0;
    let emprestimo = parseFloat(document.getElementById("emprestimo").value) || 0;
    let juros = parseFloat(document.getElementById("juros").value) || 0;
    let custosGerais = parseFloat(document.getElementById("custosGerais").value) || 0;
    let custoQuarto = parseFloat(document.getElementById("custoQuarto").value) || 0;
    let outrasReceitas = parseFloat(document.getElementById("outrasReceitas").value) || 0;

    let diarias = quartos * 365 * (ocupacao / 100);
    
    let lucroDesejado = capital * (roe / 100);
    let lucroAntesImpostos = lucroDesejado / (1 - (irc / 100));
    let valorImpostos = lucroAntesImpostos - lucroDesejado; // Para o gráfico
    
    let custoJuros = emprestimo * (juros / 100);
    let custosDiretos = diarias * custoQuarto;
    
    let custosOperacionaisTotais = custoJuros + custosGerais + custosDiretos - outrasReceitas; // Para o gráfico
    
    let receitaExigida = lucroAntesImpostos + custosOperacionaisTotais;
    let adr = diarias > 0 ? (receitaExigida / diarias) : 0;

    // Atualizar os textos
    document.getElementById("resDiarias").innerText = formatoNumero.format(diarias);
    document.getElementById("resLucro").innerText = formatoEuro.format(lucroAntesImpostos);
    document.getElementById("resReceita").innerText = formatoEuro.format(receitaExigida);
    document.getElementById("resAdr").innerText = formatoEuro.format(adr);

    // Atualizar o Gráfico
    atualizarGrafico(lucroDesejado, valorImpostos, custosOperacionaisTotais);
}

function atualizarGrafico(lucro, impostos, custos) {
    let ctx = document.getElementById('graficoHubbart').getContext('2d');
    
    // Se já existir um gráfico antigo, apaga-o para não haver sobreposição
    if (graficoCircular) {
        graficoCircular.destroy();
    }
    
    // Desenha o gráfico novo
    graficoCircular = new Chart(ctx, {
        type: 'doughnut', // Gráfico circular com buraco no meio
        data: {
            labels: ['Lucro Limpo', 'Impostos (IRC)', 'Custos Operacionais'],
            datasets: [{
                data: [lucro, impostos, custos],
                backgroundColor: ['#238636', '#da3633', '#1f6feb'], // Cores GitHub (Verde, Vermelho, Azul)
                borderColor: '#0d1117', // Cor das linhas de separação igual ao fundo
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#c9d1d9', font: {size: 13} } }
            }
        }
    });
}

function limparDados() {
    document.getElementById("formHubbart").reset();
    calcular(); 
}

window.onload = calcular;

const formatoEuro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatoNumero = new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 });
let graficoCircular;

// Função de Navegação das Tabs
function mudarSeparador(idSeparador, elementoBotao) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(idSeparador).style.display = 'block';
    elementoBotao.classList.add('active');
}

// 1. CÁLCULO DA FÓRMULA DE HUBBART
function calcularHubbart() {
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
    let valorImpostos = lucroAntesImpostos - lucroDesejado; 
    let custoJuros = emprestimo * (juros / 100);
    let custosDiretos = diarias * custoQuarto;
    let custosOperacionaisTotais = custoJuros + custosGerais + custosDiretos - outrasReceitas; 
    let receitaExigida = lucroAntesImpostos + custosOperacionaisTotais;
    let adr = diarias > 0 ? (receitaExigida / diarias) : 0;

    document.getElementById("resReceita").innerText = formatoEuro.format(receitaExigida);
    document.getElementById("resAdr").innerText = formatoEuro.format(adr);

    atualizarGrafico(lucroDesejado, valorImpostos, custosOperacionaisTotais);
}

// Gráfico da Hubbart
function atualizarGrafico(lucro, impostos, custos) {
    let ctx = document.getElementById('graficoHubbart');
    if (!ctx) return; 
    if (graficoCircular) graficoCircular.destroy();
    
    graficoCircular = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Lucro Limpo', 'Impostos (IRC)', 'Custos Operacionais'],
            datasets: [{ data: [lucro, impostos, custos], backgroundColor: ['#238636', '#da3633', '#1f6feb'], borderColor: '#0d1117', borderWidth: 3 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#c9d1d9', font: {size: 13} } } } }
    });
}

// 2. CÁLCULO DE KPIs E MARKUP
function calcularKpis() {
    let rec = parseFloat(document.getElementById("kpiReceita").value) || 0;
    let disp = parseFloat(document.getElementById("kpiDisp").value) || 0;
    let ocup = parseFloat(document.getElementById("kpiOcup").value) || 0;
    let iva = parseFloat(document.getElementById("kpiIva").value) || 0;
    let comissao = parseFloat(document.getElementById("kpiCom").value) || 0;
    let copar = parseFloat(document.getElementById("kpiCopar").value) || 0;

    let adr = ocup > 0 ? (rec / ocup) : 0;
    let revpar = disp > 0 ? (rec / disp) : 0;
    
    // NetRevPAR retira o IVA e as Comissões do RevPAR
    let netRevpar = (revpar / (1 + (iva / 100))) * (1 - (comissao / 100));
    let markup = copar > 0 ? (netRevpar / copar) : 0;

    document.getElementById("resKpiAdr").innerText = formatoEuro.format(adr);
    document.getElementById("resKpiRevpar").innerText = formatoEuro.format(revpar);
    document.getElementById("resKpiNet").innerText = formatoEuro.format(netRevpar);
    document.getElementById("resKpiMarkup").innerText = markup.toFixed(2);

    let statusHtml = markup >= 4.01 
        ? "<span style='color:#3fb950;'>✅ Negócio Sustentável (>4.01)</span>" 
        : "<span style='color:#da3633;'>⚠️ Risco Operacional (<4.01)</span>";
    document.getElementById("resKpiStatus").innerHTML = statusHtml;
}

// 3. CÁLCULO DE CUSTOS E BREAK-EVEN
function calcularCustos() {
    // 1 por 1000
    let invest = parseFloat(document.getElementById("milInvest").value) || 0;
    let quartos = parseFloat(document.getElementById("milQuartos").value) || 0;
    let precoMil = quartos > 0 ? (invest / quartos) / 1000 : 0;
    document.getElementById("resMilPreco").innerText = formatoEuro.format(precoMil);

    // Break Even
    let fixos = parseFloat(document.getElementById("beFixos").value) || 0;
    let varUnit = parseFloat(document.getElementById("beVar").value) || 0;
    let precoUnit = parseFloat(document.getElementById("bePreco").value) || 0;
    
    let margem = precoUnit - varUnit;
    let beVolume = margem > 0 ? (fixos / margem) : 0;
    let beReceita = beVolume * precoUnit;

    document.getElementById("resBeVol").innerText = formatoNumero.format(beVolume);
    document.getElementById("resBeRec").innerText = formatoEuro.format(beReceita);
}

// 4. CÁLCULO DE HIT OR MISS
function calcularHitMiss() {
    let q = parseFloat(document.getElementById("hitQuartos").value) || 0;
    
    let pBaixa = parseFloat(document.getElementById("hitBaixaP").value) || 0;
    let oBaixa = parseFloat(document.getElementById("hitBaixaO").value) || 0;
    let recBaixa = pBaixa * q * (oBaixa / 100);

    let pMedia = parseFloat(document.getElementById("hitMediaP").value) || 0;
    let oMedia = parseFloat(document.getElementById("hitMediaO").value) || 0;
    let recMedia = pMedia * q * (oMedia / 100);

    let pAlta = parseFloat(document.getElementById("hitAltaP").value) || 0;
    let oAlta = parseFloat(document.getElementById("hitAltaO").value) || 0;
    let recAlta = pAlta * q * (oAlta / 100);

    document.getElementById("resHitBaixa").innerText = formatoEuro.format(recBaixa);
    document.getElementById("resHitMedia").innerText = formatoEuro.format(recMedia);
    document.getElementById("resHitAlta").innerText = formatoEuro.format(recAlta);

    let maxRec = Math.max(recBaixa, recMedia, recAlta);
    let vencedor = "";
    if(maxRec === recBaixa) vencedor = "Época Baixa ❄️";
    if(maxRec === recMedia) vencedor = "Época Média 🌼";
    if(maxRec === recAlta) vencedor = "Época Alta ☀️";
    
    document.getElementById("resHitVencedor").innerText = vencedor + " (" + formatoEuro.format(maxRec) + ")";
}

// Arrancar todos os cálculos assim que a página abre
window.onload = function() {
    calcularHubbart();
    calcularKpis();
    calcularCustos();
    calcularHitMiss();
};

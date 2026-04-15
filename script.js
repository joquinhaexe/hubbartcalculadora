const formatoEuro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatoNumero = new Intl.NumberFormat('pt-PT');

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
    let custoJuros = emprestimo * (juros / 100);
    let custosDiretos = diarias * custoQuarto;
    
    let receitaExigida = lucroAntesImpostos + custoJuros + custosGerais + custosDiretos - outrasReceitas;
    
    let adr = diarias > 0 ? (receitaExigida / diarias) : 0;

    document.getElementById("resDiarias").innerText = formatoNumero.format(diarias);
    document.getElementById("resLucro").innerText = formatoEuro.format(lucroAntesImpostos);
    document.getElementById("resReceita").innerText = formatoEuro.format(receitaExigida);
    document.getElementById("resAdr").innerText = formatoEuro.format(adr);
}

function limparDados() {
    document.getElementById("formHubbart").reset();
    calcular(); 
}

window.onload = calcular;

const formatoEuro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
const formatoNum = new Intl.NumberFormat('pt-PT');
let grafico;

function mudarSeparador(id, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = 'block';
    btn.classList.add('active');
}

function calcularHubbart() {
    const v = (id) => parseFloat(document.getElementById(id).value) || 0;
    let diarias = v("quartos") * 365 * (v("ocupacao") / 100);
    let lucroDes = v("capital") * (v("roe") / 100);
    let lucroAntImp = lucroDes / (1 - (v("irc") / 100));
    let oper = (v("emprestimo") * (v("juros") / 100)) + v("custosGerais") + (diarias * v("custoQuarto")) - v("outrasReceitas");
    let receita = lucroAntImp + oper;
    let adr = diarias > 0 ? receita / diarias : 0;

    document.getElementById("resReceita").innerText = formatoEuro.format(receita);
    document.getElementById("resAdr").innerText = formatoEuro.format(adr);
    desenharGrafico(lucroDes, lucroAntImp - lucroDes, oper);
}

function desenharGrafico(l, i, c) {
    const ctx = document.getElementById('graficoHubbart').getContext('2d');
    if (grafico) grafico.destroy();
    grafico = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Lucro', 'IRC', 'Custos'], datasets: [{ data: [l, i, c], backgroundColor: ['#238636', '#da3633', '#1f6feb'], borderWidth: 0 }] },
        options: { plugins: { legend: { position: 'bottom', labels: { color: '#8b949e' } } } }
    });
}

function calcularKpis() {
    const v = (id) => parseFloat(document.getElementById(id).value) || 0;
    let net = ((v("kpiReceita") / v("kpiDisp")) / (1 + v("kpiIva") / 100)) * (1 - v("kpiCom") / 100);
    let markup = v("kpiCopar") > 0 ? net / v("kpiCopar") : 0;
    document.getElementById("resKpiNet").innerText = formatoEuro.format(net);
    document.getElementById("resKpiMarkup").innerText = markup.toFixed(2);
    document.getElementById("resKpiStatus").innerHTML = markup >= 4.01 ? "✅ Sustentável" : "❌ Risco";
}

function calcularCustos() {
    const v = (id) => parseFloat(document.getElementById(id).value) || 0;
    document.getElementById("resMilPreco").innerText = formatoEuro.format((v("milInvest") / v("milQuartos")) / 1000);
    let be = v("bePreco") - v("beVar") > 0 ? v("beFixos") / (v("bePreco") - v("beVar")) : 0;
    document.getElementById("resBeVol").innerText = formatoNum.format(be);
}

function calcularHitMiss() {
    const v = (id) => (parseFloat(document.getElementById(id).value) || 0) * (parseFloat(document.getElementById("hitQuartos").value) || 0) * (parseFloat(document.getElementById(id.replace("P", "O")).value) / 100);
    let b = v("hitBaixaP"), m = v("hitMediaP"), a = v("hitAltaP");
    document.getElementById("resHitBaixa").innerText = formatoEuro.format(b);
    document.getElementById("resHitMedia").innerText = formatoEuro.format(m);
    document.getElementById("resHitAlta").innerText = formatoEuro.format(a);
    let win = b > m && b > a ? "Baixa" : (m > a ? "Média" : "Alta");
    document.getElementById("resHitVencedor").innerText = win;
}

function configurarCamposMestre() {
    const t = document.getElementById("tipoCalculoMestre").value;
    const c = document.getElementById("inputsMestre");
    if (t === "copar_simples") c.innerHTML = `<div><label>RevPAR:</label><input type="number" id="m1" value="200" oninput="execMestre()"></div><div><label>Markup:</label><input type="number" id="m2" value="4.05" oninput="execMestre()"></div><div><label>IVA%:</label><input type="number" id="m3" value="6" oninput="execMestre()"></div>`;
    else if (t === "revpar_via_net") c.innerHTML = `<div><label>NetRevPAR:</label><input type="number" id="m1" value="123.5" oninput="execMestre()"></div><div><label>IVA%:</label><input type="number" id="m2" value="6" oninput="execMestre()"></div><div><label>Comissão%:</label><input type="number" id="m3" value="16" oninput="execMestre()"></div>`;
    else if (t === "copar_via_lucro") c.innerHTML = `<div><label>Lucro Líquido:</label><input type="number" id="m1" value="382500" oninput="execMestre()"></div><div><label>NetRevPAR:</label><input type="number" id="m2" value="65.2" oninput="execMestre()"></div><div><label>Volume:</label><input type="number" id="m3" value="57700" oninput="execMestre()"></div>`;
    else if (t === "invest") c.innerHTML = `<div><label>Preço:</label><input type="number" id="m1" value="150" oninput="execMestre()"></div><div><label>Quartos:</label><input type="number" id="m2" value="100" oninput="execMestre()"></div>`;
    else if (t === "ocup_nec") c.innerHTML = `<div><label>RevPAR Alvo:</label><input type="number" id="m1" value="80" oninput="execMestre()"></div><div><label>ADR:</label><input type="number" id="m2" value="120" oninput="execMestre()"></div>`;
    execMestre();
}

function execMestre() {
    const t = document.getElementById("tipoCalculoMestre").value, v = (id) => parseFloat(document.getElementById(id).value) || 0;
    let res = 0, s = "€";
    if (t === "copar_simples") res = ((v("m1") / (1 + v("m3") / 100))) / v("m2");
    else if (t === "revpar_via_net") res = (v("m1") / (1 - v("m3") / 100)) * (1 + v("m2") / 100);
    else if (t === "copar_via_lucro") res = v("m2") - (v("m1") / v("m3"));
    else if (t === "invest") res = v("m1") * 1000 * v("m2");
    else if (t === "ocup_nec") { res = (v("m1") / v("m2")) * 100; s = "%"; }
    document.getElementById("resMestreFinal").innerText = s === "€" ? formatoEuro.format(res) : res.toFixed(2) + s;
}

window.onload = () => { calcularHubbart(); calcularKpis(); calcularCustos(); calcularHitMiss(); configurarCamposMestre(); };

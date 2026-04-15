// Função para alternar os campos de input baseados no cenário escolhido
function alternarCamposInversos() {
    const cenario = document.getElementById("cenarioInverso").value;
    const container = document.getElementById("campos_inversos");
    let html = "";

    if (cenario === "copar_simples") {
        html = `<div><label>RevPAR (€):</label><input type="number" id="inv_p1" value="200" oninput="executarCenario()"></div>
                <div><label>Markup:</label><input type="number" id="inv_p2" value="4.05" oninput="executarCenario()"></div>
                <div><label>IVA (%):</label><input type="number" id="inv_p3" value="6" oninput="executarCenario()"></div>
                <div><label>Comissão (%):</label><input type="number" id="inv_p4" value="0" oninput="executarCenario()"></div>`;
    } else if (cenario === "revpar_via_net") {
        html = `<div><label>NetRevPAR (€):</label><input type="number" id="inv_p1" value="262.55" oninput="executarCenario()"></div>
                <div><label>IVA (%):</label><input type="number" id="inv_p2" value="6" oninput="executarCenario()"></div>
                <div><label>Comissão (%):</label><input type="number" id="inv_p3" value="15" oninput="executarCenario()"></div>`;
    } else if (cenario === "copar_via_lucro") {
        html = `<div><label>Lucro Líquido (€):</label><input type="number" id="inv_p1" value="382500" oninput="executarCenario()"></div>
                <div><label>NetRevPAR (€):</label><input type="number" id="inv_p2" value="65.2" oninput="executarCenario()"></div>
                <div><label>Room Nights (Volume):</label><input type="number" id="inv_p3" value="57700" oninput="executarCenario()"></div>`;
    }
    container.innerHTML = html;
    executarCenario();
}

// Executa a matemática de cada cenário
function executarCenario() {
    const cenario = document.getElementById("cenarioInverso").value;
    const p1 = parseFloat(document.getElementById("inv_p1")?.value) || 0;
    const p2 = parseFloat(document.getElementById("inv_p2")?.value) || 0;
    const p3 = parseFloat(document.getElementById("inv_p3")?.value) || 0;
    const p4 = parseFloat(document.getElementById("inv_p4")?.value) || 0;
    let resultado = "";

    if (cenario === "copar_simples") {
        let net = (p1 / (1 + (p3 / 100))) * (1 - (p4 / 100));
        resultado = "COPAR: " + formatoEuro.format(net / p2);
    } else if (cenario === "revpar_via_net") {
        // RevPAR = (NetRevPAR / (1 - comissao)) * (1 + iva)
        let rev = (p1 / (1 - (p3 / 100))) * (1 + (p2 / 100));
        resultado = "RevPAR: " + formatoEuro.format(rev);
    } else if (cenario === "copar_via_lucro") {
        // Resultado Aloj. = NetRevPAR * Volume
        // COPAR = (Resultado Aloj. - Lucro Líquido) / Volume -> Simplificando:
        let copar = p2 - (p1 / p3);
        resultado = "COPAR: " + formatoEuro.format(copar);
    }
    document.getElementById("resInversoFinal").innerText = resultado;
}

// Adiciona o arranque dos cenários no window.onload
const oldOnload = window.onload;
window.onload = function() {
    if (oldOnload) oldOnload();
    alternarCamposInversos();
};

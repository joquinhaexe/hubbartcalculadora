# 🏨 Dashboard de Gestão de Alojamentos
### Unidade Curricular: Gestão de Alojamentos (ESGHT-UAlg)

[cite_start]Este projeto é uma ferramenta interativa desenvolvida para automatizar e facilitar o cálculo de métricas essenciais na gestão hoteleira, com base no **Manual da Unidade Curricular 2025/2026**[cite: 288, 289].

---

## 🚀 Funcionalidades Principais

### 1. Fórmula de Hubbart (Bottom-Up)
[cite_start]Calcula a Diária Média (ADR) necessária para atingir os objetivos financeiros do investidor[cite: 562, 563]:
* [cite_start]**Input:** Investimento, ROE, IRC, Empréstimos e Custos Operacionais [cite: 573-584].
* [cite_start]**Output:** Receita exigida e preço médio por quarto[cite: 596, 597].

### 2. KPIs & Markup Líquido
[cite_start]Análise em tempo real da saúde financeira do alojamento[cite: 355, 384, 489]:
* [cite_start]Cálculo automático de **ADR, RevPAR e NetRevPAR** [cite: 386-389].
* [cite_start]Verificador de sustentabilidade baseado no **Markup Líquido** (Meta: > 4,01)[cite: 490].

### 3. Engenharia de Variáveis (Cálculos Inversos)
Módulo avançado para descobrir dados em falta, permitindo resolver cenários complexos do caderno de exercícios:
* [cite_start]**Descobrir o COPAR** através do RevPAR e Markup [cite: 20-24].
* [cite_start]**Descobrir o RevPAR Mínimo** através do COPAR e Markup pretendido [cite: 77-81].
* [cite_start]**Cálculo de COPAR** via Lucro Líquido e Volume de Vendas [cite: 209-213].

### 4. Análise de Custos e Estratégia
* [cite_start]**Break-Even Point:** Volume de vendas necessário para cobrir custos fixos e variáveis[cite: 188, 544].
* [cite_start]**Regra 1€ por 1000€:** Estimativa rápida de preço baseada no investimento[cite: 61, 493].
* [cite_start]**Simulador Hit or Miss:** Comparação de rentabilidade entre épocas baixa, média e alta[cite: 611, 612].

---

## 🎨 Design e Interface
* **GitHub Dark Mode:** interface visual inspirada nas cores oficiais do GitHub para maior conforto ocular
* **Gráficos Dinâmicos:** visualização da distribuição de receitas de lucro vs impostos vs custos
* **Otimizado para Impressão:** relatórios formatados especificamente para gerar PDFs limpos e organizados.

---

## 🛠️ Tecnologias Utilizadas
* **HTML5** para estrutura modular
* **CSS3** no design responsivo
* **JavaScript** para a Lógica matemática obvio????
* **Chart.js** para a visualização de dados

---
*Projeto desenvolvido para apoio ao estudo da Licenciatura em Turismo - ESGHT.*

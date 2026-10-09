let dadosTreinamentos = [];
let colaboradorAtual = null;

function obterIDFixoDaURL() {
    const arquivo = window.location.pathname.split('/').pop();
    return arquivo.split('_')[0];
}

function obterColaboradorPorID(id) {
    return dadosTreinamentos.filter(item => item.IDFIXO === id);
}

function obterNormativos(colaborador) {
    return colaborador.filter(item => item.TIPO_TREINAMENTO === "NORM");
}

function obterObrigatorios(colaborador) {
    return colaborador.filter(item => item.TIPO_TREINAMENTO !== "NORM");
}

function obterEstatisticas(colaborador) {
    const estatisticas = {
        total: colaborador.length,
        noPrazo: 0,
        vencidos: 0,
        pendentes: 0
    };

    colaborador.forEach(item => {
        if(item.STATUS === "NO PRAZO"){
            estatisticas.noPrazo++;
        }
        else if(item.STATUS === "VENCIDO"){
            estatisticas.vencidos++;
        }
        else{
            estatisticas.pendentes++;
        }
    });

    return estatisticas;
}

function criarColaboradorAtual() {
    const idfixo = obterIDFixoDaURL();
    const treinamentos = obterColaboradorPorID(idfixo);

    return {
        idfixo,
        treinamentos,
        info: treinamentos[0],
        normativos: obterNormativos(treinamentos),
        obrigatorios: obterObrigatorios(treinamentos),
        estatisticas: obterEstatisticas(treinamentos)
    };
}

function obterClasseStatus(status) {
    if(status === "NO PRAZO"){
        return "ok";
    }
    if(status === "VENCIDO"){
        return "vencido";
    }
    return "pendente";
}

function criarLinhaTreinamento(item) {
    const classeStatus = obterClasseStatus(item.STATUS);

    return `
        <tr>
            <td>${item.TREINAMENTO}</td>
            <td>${item.TREINADO_EM}</td>
            <td>${item.VENCE_EM}</td>
            <td>
                <span class="badge ${classeStatus}">
                    ${item.STATUS}
                </span>
            </td>
        </tr>
    `;
}

function renderizarColaborador(colaborador) {
    const info = colaborador.info;
    const quantidadeTreinamentos = colaborador.estatisticas.total;
    const { noPrazo, vencidos, pendentes } = colaborador.estatisticas;
    const normativosHTML = colaborador.normativos.map(criarLinhaTreinamento).join("");
    const obrigatoriosHTML = colaborador.obrigatorios.map(criarLinhaTreinamento).join("");
    const totalNormativos = colaborador.normativos.length;
    const totalObrigatorios = colaborador.obrigatorios.length;
    const partesNomeCoordenador = (info.COORDENADOR || "").trim().split(/\s+/);
    const coordenadorExibicao = partesNomeCoordenador.length > 1
        ? `${partesNomeCoordenador[0]} ${partesNomeCoordenador[partesNomeCoordenador.length - 1]}`
        : partesNomeCoordenador[0];

    document.getElementById("resultado").innerHTML = `

    <div class="card profile-card">

    <div class="info-grid">

        <div class="info-item">
            <span>Nome</span>
            <strong>${info.COLABORADOR_EXIBICAO}</strong>
            <div class="training-count">
    ${quantidadeTreinamentos} treinamentos encontrados
</div>
        </div>

        

        <div class="info-item">
            <span>Cargo</span>
            <strong>${info.CARGO}</strong>
        </div>

        <div class="info-item">
            <span>Área</span>
            <strong>${info.AREA}</strong>
        </div>

        <div class="info-item">
            <span>Coordenador</span>
            <strong>${coordenadorExibicao}</strong>
        </div>
        
        <div class="info-item">
    <span>Última Atualização</span>
    <strong>${info.ULTIMA_ATUALIZACAO_FORMATADA}</strong>
</div>

    </div>

</div>
<div class="card stats-card">

    <div class="info-grid">

        <div class="info-item stats stat-total">
            <span>Total</span>
            <strong>${quantidadeTreinamentos}</strong>
        </div>

        <div class="info-item stats stat-good">
            <span>No Prazo</span>
            <strong>
                ${noPrazo}
            </strong>
        </div>

        <div class="info-item stats stat-overdue">
            <span>Vencidos</span>
            <strong>
                ${vencidos}
            </strong>
        </div>

        <div class="info-item stats stat-pending">
            <span>Pendentes</span>
            <strong>
                ${pendentes}
            </strong>
        </div>

    </div>

</div>

<div class="filters">

    <div class="filter-group">

        <label>Buscar treinamento</label>

        <input
            type="text"
            id="filtroTreinamento"
            placeholder="Digite o treinamento..."
        >

    </div>

    <div class="filter-group">

        <label>Status</label>

        <select id="filtroStatus">

            <option value="">Todos</option>

            <option value="NO PRAZO">NO PRAZO</option>

            <option value="VENCIDO">VENCIDO</option>

            <option value="PENDENTE">PENDENTE</option>

        </select>

    </div>

    <button class="btn-limpar" id="btnLimpar">

        Limpar

    </button>

</div>

    ${totalNormativos ? `
    <section class="section normativos-section">
        <h2>📚 Treinamentos Normativos <span class="training-total" id="totalNormativos">(${totalNormativos})</span></h2>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Treinamento</th>
                        <th>Treinado em</th>
                        <th>Vence em</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${normativosHTML}
                </tbody>
            </table>
        </div>
    </section>
    ` : `
    <div class="empty-state">Nenhum treinamento normativo encontrado.</div>
    `}

    ${totalObrigatorios ? `
    <section class="section obrigatorios-section">
        <h2>📌 Treinamentos Obrigatórios <span class="training-total" id="totalObrigatorios">(${totalObrigatorios})</span></h2>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Treinamento</th>
                        <th>Treinado em</th>
                        <th>Vence em</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${obrigatoriosHTML}
                </tbody>
            </table>
        </div>
    </section>
    ` : `
    <div class="empty-state">Nenhum treinamento obrigatório encontrado.</div>
    `}

    `;
}

function aplicarFiltros() {
    const textoBusca = document.getElementById("filtroTreinamento").value.toLowerCase();
    const statusSelecionado = document.getElementById("filtroStatus").value;
    const linhas = document.querySelectorAll("tbody tr");
    let totalNormativosVisiveis = 0;
    let totalObrigatoriosVisiveis = 0;

    linhas.forEach(linha => {
        const treinamento = linha.cells[0].innerText.toLowerCase();
        const status = linha.cells[3].innerText.trim();
        const atendeTreinamento = treinamento.includes(textoBusca);
        const atendeStatus = statusSelecionado === "" || status === statusSelecionado;

        if(atendeTreinamento && atendeStatus){
            linha.style.display = "";

            if(linha.closest(".normativos-section")){
                totalNormativosVisiveis++;
            }
            else if(linha.closest(".obrigatorios-section")){
                totalObrigatoriosVisiveis++;
            }
        }
        else{
            linha.style.display = "none";
        }
    });

    const tituloNormativos = document.getElementById("totalNormativos");
    const tituloObrigatorios = document.getElementById("totalObrigatorios");

    if(tituloNormativos){
        tituloNormativos.innerText = `(${totalNormativosVisiveis})`;
    }

    if(tituloObrigatorios){
        tituloObrigatorios.innerText = `(${totalObrigatoriosVisiveis})`;
    }
}

function configurarFiltros() {
    document
        .getElementById("filtroTreinamento")
        .addEventListener("input", aplicarFiltros);

    document
        .getElementById("filtroStatus")
        .addEventListener("change", aplicarFiltros);

    document
        .getElementById("btnLimpar")
        .addEventListener("click", () => {
            document.getElementById("filtroTreinamento").value = "";
            document.getElementById("filtroStatus").value = "";
            aplicarFiltros();
        });
}

fetch('../dados.json')
    .then(response => response.json())
    .then(dados => {
        dadosTreinamentos = dados;
        colaboradorAtual = criarColaboradorAtual();
        renderizarColaborador(colaboradorAtual);
        configurarFiltros();
    });

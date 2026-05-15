const baseJSON = {
    "IP_SERVIDOR": "autoatend.prod.pdv.tasteone.linx.com.br",
    "TERMINAL_ID": "2",
    "RESHOP": "https://reshop.linx.com.br",
    "SHOW_PRISMA_PAGE": true,
    "SHOW_PAGER_PAGE": false,
    "SHOW_TELL_INFO": false,
    "SHOW_FULL_VALUE": false,
    "DISABLED_START_BUTTON": false,
    "RESHOP_REGISTER_ACTIVE": false,
    "IS_SHOW_YOUR_NAME": true,
    "SHOW_OPTIONTOEAT_PAGE": true,
    "WORK_WITH_SCALE": false,
    "IS_PDV_ONE": false,
    "posId": 2,
    "REACT_APP_TERMINALID": 2,
    "posType": 2,
    "retailerId": "E614FF5D-AF0B-44F0-A4B3-B0BE8095BC37",
    "REACT_APP_STORE_SERVER_ID": 1,
    "REACT_APP_STORE_FRANCHISE_ID": 3429,
    "REACT_APP_STORE_ID": 999
};

window.onload = function() {
    carregarHistorico();
};

function gerarJSON() {
    const terminalIdStr = document.getElementById('terminalId').value;
    const terminalIdNum = parseInt(terminalIdStr);
    const retailerId = document.getElementById('retailerId').value.trim(); 
    const serverId = parseInt(document.getElementById('serverId').value);
    const franchiseId = parseInt(document.getElementById('franchiseId').value);
    const storeId = parseInt(document.getElementById('storeId').value);

    if (!terminalIdStr || !retailerId || isNaN(serverId) || isNaN(franchiseId) || isNaN(storeId)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    let novoJSON = JSON.parse(JSON.stringify(baseJSON));

    novoJSON["TERMINAL_ID"] = terminalIdStr; 
    novoJSON["posId"] = terminalIdNum; 
    novoJSON["REACT_APP_TERMINALID"] = terminalIdNum; 
    novoJSON["retailerId"] = retailerId;
    novoJSON["REACT_APP_STORE_SERVER_ID"] = serverId;
    novoJSON["REACT_APP_STORE_FRANCHISE_ID"] = franchiseId;
    novoJSON["REACT_APP_STORE_ID"] = storeId;

    const jsonString = JSON.stringify(novoJSON, null, 2);

    document.getElementById('jsonOutput').textContent = jsonString;
    document.getElementById('outputSection').style.display = 'block';

    prepararDownload(jsonString);

    salvarNoHistorico({
        data: new Date().toLocaleString(),
        terminal: terminalIdStr,
        retailer: retailerId,
        servidor: serverId,
        franquia: franchiseId,
        loja: storeId,
        jsonText: jsonString
    });
}

function prepararDownload(jsonText) {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = url;
    downloadBtn.style.display = 'block';
}

function salvarNoHistorico(registro) {
    let historico = JSON.parse(localStorage.getItem('jsonHistory')) || [];
    historico.unshift(registro); 
    
    if (historico.length > 10) {
        historico.pop();
    }

    localStorage.setItem('jsonHistory', JSON.stringify(historico));
    carregarHistorico();
}

function carregarHistorico() {
    const historico = JSON.parse(localStorage.getItem('jsonHistory')) || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; 

    if (historico.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #777;">Nenhum histórico encontrado.</p>';
        return;
    }

    historico.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        li.innerHTML = `
            <div class="history-info">
                <strong>${item.data}</strong><br>
                Terminal: ${item.terminal} | Servidor: ${item.servidor} | Franquia: ${item.franquia} | Loja: ${item.loja}<br>
                <span style="color: #666; font-size: 12px;">Retailer: ${item.retailer || 'N/A'}</span>
            </div>
            <div class="history-actions">
                <button onclick='recarregarJSON(${index})'>Ver / Baixar</button>
            </div>
        `;
        historyList.appendChild(li);
    });
}

function recarregarJSON(index) {
    const historico = JSON.parse(localStorage.getItem('jsonHistory')) || [];
    const item = historico[index];
    
    if (item) {
        document.getElementById('terminalId').value = item.terminal;
        document.getElementById('retailerId').value = item.retailer || ''; 
        document.getElementById('serverId').value = item.servidor;
        document.getElementById('franchiseId').value = item.franquia;
        document.getElementById('storeId').value = item.loja;

        document.getElementById('jsonOutput').textContent = item.jsonText;
        document.getElementById('outputSection').style.display = 'block';
        prepararDownload(item.jsonText);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function limparHistorico() {
    if(confirm("Tem certeza que deseja apagar todo o histórico salvo?")) {
        localStorage.removeItem('jsonHistory');
        carregarHistorico();
    }
}
import { IPv4Utils as ip } from "./IPv4Utils.js";
const inIPAddress = document.getElementById('ip-address');
const inPrefix = document.getElementById('prefix');
const inSubnetsNumber = document.getElementById('subnets-number');
const btnCalc = document.getElementById('btn-calc');
const divSubnettingResults = document.getElementById('subnetting-results');
const checkBinaryOutput = document.getElementById('check-binary-output');
/*
- Obtener datos
Click en botón
- Generar arreglo de informacion
- Imprimir tabla

Click en botón para cada uno
- Funcion Extra para copiar
- Funcion descargar Imagen
- Funcion descargar CSV
*/
const calcBitsLentToNet = function (numSubnetsRequired) {
    const n = Math.ceil(Math.log2(numSubnetsRequired));
    return n;
};
const getSubnetsInfo = function (networkId, prefix, subnetsNumber) {
    let subnetId = networkId;
    let subnetsMask = ip.prefixToMask(prefix);
    let subnetBroadcast = ip.getBroadcastAddress(subnetId, subnetsMask);
    let subnetsInfo = [];
    for (let i = 0; i < subnetsNumber; i++) {
        // console.log('into getSubnetsInfo function')
        let firstAddress = ip.nextIp(subnetId);
        let lastAddress = ip.prevIp(subnetBroadcast);
        subnetsInfo.push([subnetId, subnetBroadcast, firstAddress, lastAddress]);
        subnetId = ip.nextIp(subnetBroadcast);
        subnetBroadcast = ip.getBroadcastAddress(subnetId, subnetsMask);
    }
    return subnetsInfo;
};
const printHTMLTable = function (headers, contents, HTMLcontainer, mask, hosts) {
    let table = document.createElement('table');
    table.classList.add('subnetting-table');
    let headerRow = table.insertRow();
    for (let header of headers) {
        let th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    }
    let rowsNum = contents.length; // ahora las filas
    let colsNum = contents[0].length; // ahora las columnas
    for (let row = 0; row < rowsNum; row++) {
        let tr = table.insertRow();
        for (let col = 0; col < colsNum; col++) {
            let td = document.createElement('td');
            td.textContent = contents[row][col];
            tr.appendChild(td);
        }
        if (row === 0) {
            let tdMask = document.createElement('td');
            let tdHosts = document.createElement('td');
            tdMask.rowSpan = rowsNum;
            tdHosts.rowSpan = rowsNum;
            tdMask.textContent = mask;
            tdHosts.textContent = hosts.toString();
            tr.appendChild(tdMask);
            tr.appendChild(tdHosts);
        }
    }
    HTMLcontainer.appendChild(table);
};
const calculateAndShowSubnetting = function () {
    const networkId = (inIPAddress.value === "") ? null : inIPAddress.value;
    const basePrefix = (inPrefix.value === "") ? null : Number(inPrefix.value);
    const subnetsRequired = (inSubnetsNumber.value === "") ? null : Number(inSubnetsNumber.value);
    if (subnetsRequired === null || basePrefix === null || networkId === null) {
        return;
    }
    let bitsLentToNet = calcBitsLentToNet(subnetsRequired);
    let newPrefix = basePrefix + bitsLentToNet;
    // console.log(newPrefix)
    let subnetsNumber = 2 ** bitsLentToNet;
    let subnetsInfo = getSubnetsInfo(networkId, newPrefix, subnetsNumber);
    let subnetsMask = ip.prefixToMask(newPrefix);
    let hostsNumber = ip.getNumberOfHosts(newPrefix);
    const TABLE_HEADERS = [
        'ID de Red',
        'Broadcast',
        'Primera IP utilizable',
        'Última IP utilizable',
        'Máscara',
        '# Hosts'
    ];
    // console.table(subnetsInfo);  
    // console.table(binarySubnets);
    if (checkBinaryOutput.checked) {
        subnetsInfo = ip.getBinarySubnetsInfo(subnetsInfo);
        subnetsMask = ip.ipv4ToBinary(subnetsMask);
    }
    divSubnettingResults.replaceChildren();
    printHTMLTable(TABLE_HEADERS, subnetsInfo, divSubnettingResults, subnetsMask, hostsNumber);
};
btnCalc.addEventListener('click', calculateAndShowSubnetting);
checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);

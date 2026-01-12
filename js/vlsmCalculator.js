import { IPv4Utils as ip } from "./IPv4Utils.js";
const inIPAddress = document.getElementById('ip-address');
const inPrefix = document.getElementById('prefix');
const inSubnetHosts = document.getElementById('subnet-hosts');
const btnCalc = document.getElementById('btn-calc');
const divSubnettingResults = document.getElementById('subnetting-results');
const checkBinaryOutput = document.getElementById('check-binary-output');
const checkSubnetName = document.getElementById('check-subnet-name');
const calcBitsLentToNet = function (subnetsHostRequired, prefix) {
    let j = 32 - prefix;
    let n = [];
    subnetsHostRequired.forEach(subnetsHost => {
        n.push(j - Math.ceil(Math.log2(subnetsHost + 2)));
    });
    return n;
};
const getSubnetsInfo = function (networkId, prefixes, subnetsNumber) {
    let subnetId = networkId;
    let subnetsMask = prefixes.map((prefix) => ip.prefixToMask(prefix));
    let subnetBroadcast;
    let availableHosts = prefixes.map((prefix) => ip.getNumberOfHosts(prefix).toString());
    let subnetsInfo = [];
    for (let i = 0; i < subnetsNumber; i++) {
        subnetBroadcast = ip.getBroadcastAddress(subnetId, subnetsMask[i]);
        //console.log(subnetId + " y " + subnetsMask[i])
        //console.log(ip.getBroadcastAddress(subnetId,subnetsMask[i]))
        // console.log('into getSubnetsInfo function')
        let firstAddress = ip.nextIp(subnetId);
        let lastAddress = ip.prevIp(subnetBroadcast);
        let subnetPrefix = '/' + prefixes[i].toString();
        subnetsInfo.push([subnetId, subnetBroadcast, firstAddress, lastAddress, subnetsMask[i], subnetPrefix, availableHosts[i]]);
        // console.log([subnetId, subnetBroadcast, subnetsMask[i]])
        subnetId = ip.nextIp(subnetBroadcast);
        //console.log(subnetId + " y " + subnetsMask[i])
    }
    return subnetsInfo;
};
const printHTMLTable = function (headers, contents, HTMLcontainer, includeNames = false) {
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
        // Para inputs
        if (includeNames) {
            let tdName = document.createElement('td');
            let inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.className = 'subnet-name-input';
            inputName.placeholder = `Subred ${row + 1}`;
            tdName.appendChild(inputName);
            tr.appendChild(tdName);
        }
        for (let col = 0; col < colsNum; col++) {
            let td = document.createElement('td');
            td.textContent = contents[row][col];
            tr.appendChild(td);
        }
    }
    HTMLcontainer.appendChild(table);
};
const calculateAndShowSubnetting = function () {
    const networkId = (inIPAddress.value === "") ? null : inIPAddress.value;
    const basePrefix = (inPrefix.value === "") ? null : Number(inPrefix.value);
    let subnetsHostRequired;
    if (inSubnetHosts.value.trim() === "") {
        subnetsHostRequired = null;
    }
    else {
        subnetsHostRequired = inSubnetHosts.value.trim()
            .split(",")
            .map(host => Number(host))
            .sort((a, b) => b - a);
    }
    if (subnetsHostRequired === null || basePrefix === null || networkId === null) {
        return;
    }
    let bitsLentToNet = calcBitsLentToNet(subnetsHostRequired, basePrefix);
    //console.log(bitsLentToNet)
    let newPrefixes = bitsLentToNet.map((bits) => basePrefix + bits);
    // console.log(newPrefixes)
    // console.log(newPrefixes.map((prefix) => ip.prefixToMask(prefix)))
    let subnetsNumber = subnetsHostRequired.length;
    let subnetsInfo = getSubnetsInfo(networkId, newPrefixes, subnetsNumber);
    //console.table(subnetsInfo);
    // console.log(ip.nextIp('192.168.0.191'))
    // console.log(ip.getBroadcastAddress('192.168.0.192','255.255.255.224'))
    const TABLE_HEADERS = [
        'ID de Red',
        'Broadcast',
        'Primera IP utilizable',
        'Última IP utilizable',
        'Máscara',
        'Prefijo',
        '# Hosts'
    ];
    let includeNames = checkSubnetName.checked;
    if (includeNames)
        TABLE_HEADERS.unshift('Nombre');
    if (checkBinaryOutput.checked) {
        subnetsInfo = ip.getBinarySubnetsInfo(subnetsInfo);
    }
    divSubnettingResults.replaceChildren();
    printHTMLTable(TABLE_HEADERS, subnetsInfo, divSubnettingResults, includeNames);
};
btnCalc.addEventListener('click', calculateAndShowSubnetting);
checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);
checkSubnetName.addEventListener('change', calculateAndShowSubnetting);

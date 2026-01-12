import { IPv4Utils as ip } from "./IPv4Utils.js";

const inIPAddress = document.getElementById('ip-address') as HTMLInputElement;
const inPrefix = document.getElementById('prefix') as HTMLInputElement;
const inSubnetHosts = document.getElementById('subnet-hosts') as HTMLInputElement;
const btnCalc = document.getElementById('btn-calc') as HTMLButtonElement;
const divSubnettingResults = document.getElementById('subnetting-results') as HTMLDivElement;
const checkBinaryOutput = document.getElementById('check-binary-output') as HTMLInputElement;
const checkSubnetName = document.getElementById('check-subnet-name') as HTMLInputElement;

const calcBitsLentToNet = function(subnetsHostRequired: number[], prefix: number): number[]{
    let j: number = 32 - prefix;
    let n: number[] = [];
    subnetsHostRequired.forEach(subnetsHost => {
        n.push(j - Math.ceil(Math.log2(subnetsHost+2)));
    });
    
    return n;
} 

const getSubnetsInfo = function(networkId: string, prefixes: number[], subnetsNumber: number): string[][]{    
    let subnetId: string = networkId;
    let subnetsMask: string[] = prefixes.map((prefix) => ip.prefixToMask(prefix));
    let subnetBroadcast: string;
    let availableHosts: string[] = prefixes.map((prefix)=>ip.getNumberOfHosts(prefix).toString());

    let subnetsInfo: string[][] = [];

    for (let i = 0; i < subnetsNumber; i++) {
        subnetBroadcast = ip.getBroadcastAddress(subnetId, subnetsMask[i]);
        //console.log(subnetId + " y " + subnetsMask[i])
        //console.log(ip.getBroadcastAddress(subnetId,subnetsMask[i]))
        // console.log('into getSubnetsInfo function')
        let firstAddress: string = ip.nextIp(subnetId);
        let lastAddress: string = ip.prevIp(subnetBroadcast);
        let subnetPrefix: string = '/' + prefixes[i].toString();
        subnetsInfo.push([subnetId, subnetBroadcast, firstAddress, lastAddress, subnetsMask[i], subnetPrefix, availableHosts[i]]);
        // console.log([subnetId, subnetBroadcast, subnetsMask[i]])
        subnetId = ip.nextIp(subnetBroadcast);
        //console.log(subnetId + " y " + subnetsMask[i])
    }

    return subnetsInfo;
}

const printHTMLTable = function(headers: string[], contents: any[][], HTMLcontainer: HTMLDivElement, includeNames: boolean = false): void {
    let table = document.createElement('table');
    table.classList.add('subnetting-table');

    let headerRow = table.insertRow();
    for (let header of headers) {
        let th = document.createElement('th');
        th.innerHTML = header;
        headerRow.appendChild(th);
    }

    let rowsNum = contents.length;          // ahora las filas
    let colsNum = contents[0].length;       // ahora las columnas

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
}


const calculateAndShowSubnetting = function(): void{
    const networkId: string | null = (inIPAddress.value === "") ? null : inIPAddress.value;
    const basePrefix: number | null = (inPrefix.value === "") ? null : Number(inPrefix.value);
    let subnetsHostRequired: number[] | null;

    if (inSubnetHosts.value.trim() === "") {
        subnetsHostRequired = null;
    } else {
        subnetsHostRequired = inSubnetHosts.value.trim()
            .split(",")                
            .map(host => Number(host)) 
            .sort((a, b) => b - a);
    }


    if (subnetsHostRequired === null || basePrefix === null || networkId  === null) {
        return;
    }


    let bitsLentToNet: number[] = calcBitsLentToNet(subnetsHostRequired, basePrefix);
    //console.log(bitsLentToNet)
    let newPrefixes: number[] = bitsLentToNet.map((bits)=> basePrefix + bits);
    // console.log(newPrefixes)
    // console.log(newPrefixes.map((prefix) => ip.prefixToMask(prefix)))

    let subnetsNumber: number = subnetsHostRequired.length;

    let subnetsInfo: string[][] = getSubnetsInfo(networkId, newPrefixes, subnetsNumber);
    //console.table(subnetsInfo);
    // console.log(ip.nextIp('192.168.0.191'))
    // console.log(ip.getBroadcastAddress('192.168.0.192','255.255.255.224'))
    const TABLE_HEADERS: string[] = [
        'ID de Red',
        'Broadcast',
        'Primera IP utilizable',
        'Última IP utilizable',
        'Máscara',
        'Prefijo',
        '# Hosts'
    ];

    let includeNames: boolean = checkSubnetName.checked;
    if(includeNames)
        TABLE_HEADERS.unshift('Nombre');

    if(checkBinaryOutput.checked){
        subnetsInfo = ip.getBinarySubnetsInfo(subnetsInfo);
    }

    divSubnettingResults.replaceChildren();

    printHTMLTable(
        TABLE_HEADERS,
        subnetsInfo,
        divSubnettingResults,
        includeNames
    );
}

btnCalc.addEventListener('click', calculateAndShowSubnetting);
checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);
checkSubnetName.addEventListener('change', calculateAndShowSubnetting);
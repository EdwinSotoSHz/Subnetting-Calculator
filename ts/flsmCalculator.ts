import { IPv4Utils as ip } from "./IPv4Utils.js";

const inIPAddress = document.getElementById('ip-address') as HTMLInputElement;
const inPrefix = document.getElementById('prefix') as HTMLInputElement;
const inSubnetsNumber = document.getElementById('subnets-number') as HTMLInputElement;
const btnCalc = document.getElementById('btn-calc') as HTMLButtonElement;
const divSubnettingResults = document.getElementById('subnetting-results') as HTMLDivElement;
const checkBinaryOutput = document.getElementById('check-binary-output') as HTMLInputElement;
const checkSubnetName = document.getElementById('check-subnet-name') as HTMLInputElement;

/*
!- Obtener datos 
!Click en botón
!- Generar arreglo de informacion
!- Imprimir tabla
!
Click en botón para cada uno
- Funcion Extra para copiar
- Funcion descargar Imagen
- Funcion descargar CSV
*/
const calcBitsLentToNet = function(numSubnetsRequired: number): number{
    const n: number = Math.ceil(Math.log2(numSubnetsRequired));
    return n;
} 

const getSubnetsInfo = function(networkId: string, prefix: number, subnetsNumber: number): string[][]{    
    let subnetId: string = networkId;
    let subnetsMask: string = ip.prefixToMask(prefix);
    let subnetBroadcast: string = ip.getBroadcastAddress(subnetId, subnetsMask);
    let subnetsInfo: string[][] = [];

    for (let i = 0; i < subnetsNumber; i++) {
        // console.log('into getSubnetsInfo function')
        let firstAddress: string = ip.nextIp(subnetId);
        let lastAddress: string = ip.prevIp(subnetBroadcast);
        subnetsInfo.push([subnetId, subnetBroadcast, firstAddress, lastAddress]);
        subnetId = ip.nextIp(subnetBroadcast);
        subnetBroadcast = ip.getBroadcastAddress(subnetId, subnetsMask);
    }

    return subnetsInfo;
}

const printHTMLTable = function(headers: string[], contents: any[][], HTMLcontainer: HTMLDivElement, mask: string, hosts: number, includeNames: boolean = false): void {
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
}

const calculateAndShowSubnetting = function(): void{
    const networkId: string | null = (inIPAddress.value === "") ? null : inIPAddress.value;
    const basePrefix: number | null = (inPrefix.value === "") ? null : Number(inPrefix.value);
    const subnetsRequired: number | null = (inSubnetsNumber.value === "") ? null : Number(inSubnetsNumber.value);

    if (subnetsRequired === null || basePrefix === null || networkId  === null) {
        return;
    }
    
    let bitsLentToNet: number = calcBitsLentToNet(subnetsRequired);
    
    let newPrefix: number = basePrefix + bitsLentToNet;
    // console.log(newPrefix)

    let subnetsNumber: number = 2**bitsLentToNet;

    let subnetsInfo: string[][] = getSubnetsInfo(networkId, newPrefix, subnetsNumber);
    let subnetsMask: string = ip.prefixToMask(newPrefix);
    let hostsNumber: number = ip.getNumberOfHosts(newPrefix);
    const TABLE_HEADERS: string[] = [
        'ID de Red',
        'Broadcast',
        'Primera IP utilizable',
        'Última IP utilizable',
        'Máscara',
        '# Hosts'
    ];

    let includeNames: boolean = checkSubnetName.checked;
    if(includeNames)
        TABLE_HEADERS.unshift('Nombre');

    // console.table(subnetsInfo);  

    if(checkBinaryOutput.checked){
        subnetsInfo = ip.getBinarySubnetsInfo(subnetsInfo);
        subnetsMask = ip.ipv4ToBinary(subnetsMask);
    }

    divSubnettingResults.replaceChildren();

    printHTMLTable(
        TABLE_HEADERS,
        subnetsInfo,
        divSubnettingResults,
        subnetsMask,
        hostsNumber,
        includeNames
    );
}

btnCalc.addEventListener('click', calculateAndShowSubnetting);
checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);
checkSubnetName.addEventListener('change', calculateAndShowSubnetting);
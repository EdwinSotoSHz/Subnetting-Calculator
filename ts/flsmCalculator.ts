import { IPv4Utils as ip } from "./IPv4Utils.js";

const inIPAddress = document.getElementById('ip-address') as HTMLInputElement;
const inPrefix = document.getElementById('prefix') as HTMLInputElement;
const inSubnetsNumber = document.getElementById('subnets-number') as HTMLInputElement;
const btnCalc = document.getElementById('btn-calc') as HTMLButtonElement;
const divSubnettingResults = document.getElementById('subnetting-results') as HTMLDivElement;

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
let networkId: string | null = "";
let basePrefix: number | null = null;
let subnetsRequired: number | null = null;

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

const printHTMLTable = function(headers: string[], contents: any[][], HTMLcontainer: HTMLDivElement, mask: string, hosts: number): void {
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

btnCalc.addEventListener('click', ()=>{
    
    

    networkId = (inIPAddress.value === "") ? null : inIPAddress.value;
    basePrefix = (inPrefix.value === "") ? null : Number(inPrefix.value);
    subnetsRequired = (inSubnetsNumber.value === "") ? null : Number(inSubnetsNumber.value);
    
    // if(subnetsRequired)
    //     console.log('n = ' + calcBitsLentToNet(subnetsRequired))

    let bitsLentToNet: number = 0;
    if(subnetsRequired)
        bitsLentToNet = calcBitsLentToNet(subnetsRequired);
    
    let newPrefix: number = 0;
    if(basePrefix)
        newPrefix = basePrefix + bitsLentToNet;
    // console.log(newPrefix)

    let subnetsNumber: number = 2**bitsLentToNet;

    let subnetsInfo: (string)[][] = [];
    if(networkId)
        subnetsInfo = getSubnetsInfo(networkId, newPrefix, subnetsNumber);
    
    // console.table(subnetsInfo);  
    console.table(ip.getBinarySubnets(subnetsInfo[0], subnetsInfo[1]));
    divSubnettingResults.replaceChildren();
    let tableHeaders = ['ID de Red','Broadcast','Primera ip utilizable','Última ip utilizable','Máscara','# Hosts'];
    printHTMLTable(tableHeaders, subnetsInfo, divSubnettingResults, ip.prefixToMask(newPrefix), ip.getNumberOfHosts(newPrefix));

})
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
    console.log(bitsLentToNet)
    //let newPrefix: number = basePrefix + bitsLentToNet;
    // console.log(newPrefix)

    //let subnetsNumber: number = 2**bitsLentToNet;

    //let subnetsInfo: string[][] = getSubnetsInfo(networkId, newPrefix, subnetsNumber);
    //let subnetsMask: string = ip.prefixToMask(newPrefix);
    //let hostsNumber: number = ip.getNumberOfHosts(newPrefix);
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
    // console.table(binarySubnets);

    if(checkBinaryOutput.checked){
        //subnetsInfo = ip.getBinarySubnetsInfo(subnetsInfo);
        //subnetsMask = ip.ipv4ToBinary(subnetsMask);
    }

    divSubnettingResults.replaceChildren();

    // printHTMLTable(
    //     TABLE_HEADERS,
    //     subnetsInfo,
    //     divSubnettingResults,
    //     subnetsMask,
    //     hostsNumber,
    //     includeNames
    // );
}

btnCalc.addEventListener('click', calculateAndShowSubnetting);
//checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);
//checkSubnetName.addEventListener('change', calculateAndShowSubnetting);
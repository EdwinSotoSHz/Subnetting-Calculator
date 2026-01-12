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
    console.log(newPrefixes);
    //let subnetsNumber: number = 2**bitsLentToNet;
    //let subnetsInfo: string[][] = getSubnetsInfo(networkId, newPrefix, subnetsNumber);
    //let subnetsMask: string = ip.prefixToMask(newPrefix);
    //let hostsNumber: number = ip.getNumberOfHosts(newPrefix);
    const TABLE_HEADERS = [
        'ID de Red',
        'Broadcast',
        'Primera IP utilizable',
        'Última IP utilizable',
        'Máscara',
        '# Hosts'
    ];
    let includeNames = checkSubnetName.checked;
    if (includeNames)
        TABLE_HEADERS.unshift('Nombre');
    // console.table(subnetsInfo);  
    // console.table(binarySubnets);
    if (checkBinaryOutput.checked) {
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
};
btnCalc.addEventListener('click', calculateAndShowSubnetting);
export {};
//checkBinaryOutput.addEventListener('change', calculateAndShowSubnetting);
//checkSubnetName.addEventListener('change', calculateAndShowSubnetting);

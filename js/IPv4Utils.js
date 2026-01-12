export class IPv4Utils {
    // Se usa la conversión forzosa de un número entre 0 y 255 (sin signo) a 32 bits para trabajar los octetos en un entero uint32 (0 a 255 no puede ocupar mas de 8 bits)
    //Convertir los 4 numeros de la cadena a numeros de 32 bits (realmente solo ocupan 8 o menos), y recorrerlos 8 bits para llenar los 32 bits (numero entero que represente la ip)  
    static ipv4ToUint32(ipAddress) {
        const UINT32 = ipAddress
            .split(".")
            .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
        return UINT32;
    }
    //Aislar cada uno de los 8 bits de un numero de 32 bits y garantizar que los primeros 3 octetos solo incluyan máximo 8 bits 
    static Uint32Toipv4(uint32) {
        const IPV4 = [
            (uint32 >>> 24) & 255,
            (uint32 >>> 16) & 255,
            (uint32 >>> 8) & 255,
            uint32 & 255
        ].join(".");
        return IPV4;
    }
    // Si el prefijo es cero se queda como 0, pero si no se usa un numero de 32 bits (todos 1 con 0xFFFFFFFF) y se recorre a la izquierda los bits de host que se ocupen y se quita el signo
    static prefixToMask(prefix) {
        const MASK_UINT32 = (prefix === 0) ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
        return IPv4Utils.Uint32Toipv4(MASK_UINT32);
    }
    // OR binario entre dos Uint32, negando todos los bits de la máscara, pero quitando el signo "-", obtiene broadcast
    static getBroadcastAddress(networkId, mask) {
        const SUB_NETWORK_ID = IPv4Utils.ipv4ToUint32(networkId);
        const SUB_NETWORK_MASK = IPv4Utils.ipv4ToUint32(mask);
        const BROADCAST_ADDRESS = SUB_NETWORK_ID | (~SUB_NETWORK_MASK >>> 0);
        return IPv4Utils.Uint32Toipv4(BROADCAST_ADDRESS);
    }
    // AND binario para obtener ID de red (no usado en este proyecto)
    static getNetworkIdAddress(ip, mask) {
        const IP_UINT32 = IPv4Utils.ipv4ToUint32(ip);
        const MASK_UINT32 = IPv4Utils.ipv4ToUint32(mask);
        const NETWORK_ID = IP_UINT32 & MASK_UINT32;
        return IPv4Utils.Uint32Toipv4(NETWORK_ID);
    }
    // Siguiente IP
    static nextIp(ipAddress) {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(UINT32 + 1);
    }
    // IP anterior
    static prevIp(ipAddress) {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(UINT32 - 1);
    }
    // Formula estandar de subnetting
    static getNumberOfHosts(prefix) {
        const HOSTS = 2 ** (32 - prefix) - 2;
        return HOSTS;
    }
    // Desplazamiento (>>>) mueve los bits, y el AND binario con 255 (0xFF) aísla el octeto.
    static ipv4ToBinary(ipAddress) {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);
        const BINARY_OCTETS = [
            (UINT32 >>> 24) & 255,
            (UINT32 >>> 16) & 255,
            (UINT32 >>> 8) & 255,
            UINT32 & 255
        ];
        const FILLED_STRING_OCTETS = BINARY_OCTETS.map((octet) => octet.toString(2).padStart(8, "0")).join(".");
        return FILLED_STRING_OCTETS;
    }
    static getBinarySubnetsInfo(subnetsInfoArray) {
        let binarySubnetsInfo = [];
        const regexIPv4 = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        subnetsInfoArray.forEach((subnetInfo) => {
            binarySubnetsInfo.push(subnetInfo.map((value) => {
                if (regexIPv4.test(value))
                    return IPv4Utils.ipv4ToBinary(value);
                return value;
            }));
        });
        return binarySubnetsInfo;
    }
}

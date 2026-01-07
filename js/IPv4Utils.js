export class IPv4Utils {
    // Se usa la conversión forzosa de un número entre 0 y 255 (sin signo) a 32 bits para trabajar los octetos en un entero uint32 (0 a 255 no puede ocupar mas de 8 bits)
    //Convertir los 4 numeros de la cadena a numeros de 32 bits (realmente solo ocupan 8 o menos), y recorrerlos 8 bits para llenar los 32 bits (numero entero que represente la ip)  
    static ipv4ToUint32(ipAddress) {
        const uint32 = ipAddress
            .split(".")
            .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
        return uint32;
    }
    //Aislar cada uno de los 8 bits de un numero de 32 bits y garantizar que los primeros 3 octetos solo incluyan máximo 8 bits 
    static Uint32Toipv4(uint32) {
        const ipv4 = [
            (uint32 >>> 24) & 255,
            (uint32 >>> 16) & 255,
            (uint32 >>> 8) & 255,
            uint32 & 255
        ].join(".");
        return ipv4;
    }
    // Si el prefijo es cero se queda como 0, pero si no se usa un numero de 32 bits (todos 1 con 0xFFFFFFFF) y se recorre a la izquierda los bits de host que se ocupen y se quita el signo
    static prefixToMask(prefix) {
        const maskUint32 = (prefix === 0) ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
        return IPv4Utils.Uint32Toipv4(maskUint32);
    }
    // OR binario entre dos Uint32, negando todos los bits de la máscara, pero quitando el signo "-", obtiene broadcast
    static getBroadcastAddress(networkId, mask) {
        const subNetworkId = IPv4Utils.ipv4ToUint32(networkId);
        const subNetworkMask = IPv4Utils.ipv4ToUint32(mask);
        const broadcastAddress = subNetworkId | (~subNetworkMask >>> 0);
        return IPv4Utils.Uint32Toipv4(broadcastAddress);
    }
    // AND binario para obtener ID de red (no usado en este proyecto)
    static getNetworkIdAddress(ip, mask) {
        const ipInt = IPv4Utils.ipv4ToUint32(ip);
        const maskInt = IPv4Utils.ipv4ToUint32(mask);
        const networkId = ipInt & maskInt;
        return IPv4Utils.Uint32Toipv4(networkId);
    }
    // Siguiente IP
    static nextIp(ipAddress) {
        const uint32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(uint32 + 1);
    }
    // IP anterior
    static prevIp(ipAddress) {
        const uint32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(uint32 - 1);
    }
    // Formula estandar de subnetting
    static getNumberOfHosts(prefix) {
        const hosts = 2 ** (32 - prefix) - 2;
        return hosts;
    }
    // Desplazamiento (>>>) mueve los bits, y el AND binario con 255 (0xFF) aísla el octeto.
    static ipv4ToBinary(ipAddress) {
        const uint32 = IPv4Utils.ipv4ToUint32(ipAddress);
        const binaryOctets = [
            (uint32 >>> 24) & 255,
            (uint32 >>> 16) & 255,
            (uint32 >>> 8) & 255,
            uint32 & 255
        ];
        const filledStringOctets = binaryOctets.map((octet) => octet.toString(2).padStart(8, "0")).join(".");
        return filledStringOctets;
    }
    static getBinarySubnets(networkIdArray, broadcastArray) {
        const idArray = networkIdArray.map((subnetId) => IPv4Utils.ipv4ToBinary(subnetId));
        const brArray = broadcastArray.map((subnetBroadcast) => IPv4Utils.ipv4ToBinary(subnetBroadcast));
        return [idArray, brArray];
    }
}

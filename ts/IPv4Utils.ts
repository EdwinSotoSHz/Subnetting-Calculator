export class IPv4Utils {
    // Se usa la conversión forzosa de un número entre 0 y 255 (sin signo) a 32 bits para trabajar los octetos en un entero uint32 (0 a 255 no puede ocupar mas de 8 bits)

    //Convertir los 4 numeros de la cadena a numeros de 32 bits (realmente solo ocupan 8 o menos), y recorrerlos 8 bits para llenar los 32 bits (numero entero que represente la ip)  
    public static ipv4ToUint32(ipAddress: string): number{
        const UINT32 = ipAddress
                    .split(".")
                    .reduce((acc, octet) => (acc << 8) + Number(octet), 0)  >>> 0;

        return UINT32;
    }

    //Aislar cada uno de los 8 bits de un numero de 32 bits y garantizar que los primeros 3 octetos solo incluyan máximo 8 bits 
    public static  Uint32Toipv4(uint32: number): string {
        const IPV4 = [
            (uint32 >>> 24) & 255,
            (uint32 >>> 16) & 255,
            (uint32 >>> 8) & 255,
            uint32 & 255
        ].join(".");
        
        return IPV4;
    }

    // Si el prefijo es cero se queda como 0, pero si no se usa un numero de 32 bits (todos 1 con 0xFFFFFFFF) y se recorre a la izquierda los bits de host que se ocupen y se quita el signo
    public static prefixToMask(prefix: number): string {
        const MASK_UINT32 = (prefix === 0) ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
        return IPv4Utils.Uint32Toipv4(MASK_UINT32);
    }

    // OR binario entre dos Uint32, negando todos los bits de la máscara, pero quitando el signo "-", obtiene broadcast
    public static getBroadcastAddress(networkId: string, mask: string): string {
        const SUB_NETWORK_ID = IPv4Utils.ipv4ToUint32(networkId);
        const SUB_NETWORK_MASK  = IPv4Utils.ipv4ToUint32(mask);

        const BROADCAST_ADDRESS = SUB_NETWORK_ID | (~SUB_NETWORK_MASK >>> 0);

        return IPv4Utils.Uint32Toipv4(BROADCAST_ADDRESS);
    }

    // AND binario para obtener ID de red (no usado en este proyecto)
    public static getNetworkIdAddress(ip: string, mask:string):string {
        const IP_UINT32   = IPv4Utils.ipv4ToUint32(ip);
        const MASK_UINT32 = IPv4Utils.ipv4ToUint32(mask);

        const NETWORK_ID = IP_UINT32 & MASK_UINT32;

        return IPv4Utils.Uint32Toipv4(NETWORK_ID);
    }

    // Siguiente IP
    public static nextIp(ipAddress: string): string {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(UINT32 + 1);
    }

    // IP anterior
    public static prevIp(ipAddress: string): string {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);
        return IPv4Utils.Uint32Toipv4(UINT32 - 1);
    }

    // Formula estandar de subnetting
    public static getNumberOfHosts(prefix: number): number{
        const HOSTS = 2**(32 - prefix) - 2;
        return HOSTS;
    }

    // Desplazamiento (>>>) mueve los bits, y el AND binario con 255 (0xFF) aísla el octeto.
    public static ipv4ToBinary(ipAddress: string): string {
        const UINT32 = IPv4Utils.ipv4ToUint32(ipAddress);

        const BINARY_OCTETS: number[] = [
            (UINT32 >>> 24) & 255,
            (UINT32 >>> 16) & 255,
            (UINT32 >>> 8) & 255,
            UINT32 & 255
        ];
        
        const FILLED_STRING_OCTETS: string = BINARY_OCTETS.map((octet) => octet.toString(2).padStart(8, "0")).join(".");

        return FILLED_STRING_OCTETS;
    }

    public static getBinarySubnets(networkIdArray: string[], broadcastArray: string[]): string[][]{
        const ID_ARRAY: string[] = networkIdArray.map((subnetId) => IPv4Utils.ipv4ToBinary(subnetId));
        const BR_ARRAY: string[] = broadcastArray.map((subnetBroadcast) => IPv4Utils.ipv4ToBinary(subnetBroadcast));

        return [ID_ARRAY, BR_ARRAY]
    } 

}
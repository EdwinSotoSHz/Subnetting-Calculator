import ip from "ip";

document.getElementById("ip").innerHTML = `Dirección IP local:, ${ip.address()}`;
document.getElementById("ip1").innerHTML = `¿Es privada 192.168.0.1?, ${ip.isPrivate("192.168.0.1")}`;

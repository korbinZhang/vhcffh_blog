function isValidMacAddress(mac) {
  const macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  return macPattern.test(mac);
}

function isValidIPv6(ipv6) {
  // 此处只是一个简单示例，实际上需要更复杂的IPv6合法性检查
  const ipv6Pattern = /^[0-9A-Fa-f:]+$/;
  return ipv6Pattern.test(ipv6);
}

function ipv6ToMac(ipv6) {
  ipv6 = ipv6.toUpperCase();
  const ipv6Parts = ipv6.split(":");
  if (ipv6Parts[0] != "FE80" || ipv6Parts.length < 5 || !isValidIPv6(ipv6)) {
    throw new Error("Invalid Linklocal IPv6 address format");
  }
  const mac =
    (parseInt(ipv6Parts[ipv6Parts.length-4].substring(0, 2), 16) ^ 2)
      .toString(16)
      .padStart(2, "0") +
    ":" +
    ipv6Parts[ipv6Parts.length-4].substring(2, 4) +
    ":" +
    ipv6Parts[ipv6Parts.length-3].substring(0, 2) +
    ":" +
    ipv6Parts[ipv6Parts.length-2].substring(2, 4) +
    ":" +
    ipv6Parts[ipv6Parts.length-1].substring(0, 2) +
    ":" +
    ipv6Parts[ipv6Parts.length-1].substring(2, 4);
  return mac.toUpperCase();
}

function macToEUI64IPv6(mac) {
  const macParts = mac.split(":");
  if (macParts.length !== 6 || !isValidMacAddress(mac)) {
    throw new Error("Invalid MAC address format");
  }

  // Modify MAC address to create EUI-64 format
  const modifiedMac = [
    (parseInt(macParts[0], 16) ^ 2).toString(16).padStart(2, "0"),
    macParts[1],
    macParts[2],
    "ff",
    "fe",
    macParts[3],
    macParts[4],
    macParts[5],
  ];

  // Create EUI-64 IPv6 address
  const eui64Address =
    "fe80::" +
    modifiedMac[0] +
    modifiedMac[1] +
    ":" +
    modifiedMac[2] +
    modifiedMac[3] +
    ":" +
    modifiedMac[4] +
    modifiedMac[5] +
    ":" +
    modifiedMac[6] +
    modifiedMac[7];

  return eui64Address.toUpperCase();
}

function init() {
  const ipv6_button = document.getElementById("ipv6_button");
  const mac_button = document.getElementById("mac_button");

  function mac_button_click() {
    let mac = document.getElementById("mac").value;
    if (mac == "") {
      mac = "12:34:56:78:9A:BC";
    }
    try {
      const ipv6 = macToEUI64IPv6(mac);
      document.getElementById("ipv6").value = ipv6;
    } catch (error) {
      alert(error);
    }
  }

  function ipv6_button_click() {
    let ipv6 = document.getElementById("ipv6").value;
    if (ipv6 == "") {
      ipv6 = "FE80::1034:56FF:FE78:9ABC";
    }
    try {
      document.getElementById("mac").value = ipv6ToMac(ipv6);
    } catch (error) {
      alert(error);
    }
  }

  mac_button.addEventListener("click", mac_button_click);
  ipv6_button.addEventListener("click", ipv6_button_click);
}

init();

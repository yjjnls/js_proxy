var Proxy = require('./src/proxy');
var CryptoJS = require("crypto-js");

var options = {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
}
function EncryptData(publicKey, data) {
    let pubKey = Proxy.public_key_from_bytes(Proxy.from_hex(publicKey));
    var cp = Proxy.encapsulate(pubKey);
    var symKey = Proxy.to_hex(cp.symmetric_key.to_bytes());

    var key = CryptoJS.enc.Utf8.parse(symKey);
    var encrypted = CryptoJS.AES.encrypt(data, key, options);

    return {
        key: Proxy.to_hex(cp.capsule.to_bytes()),
        cipher: encrypted.toString()
    }
}

function DecryptData(privateKey, obj) {
    let priKey = Proxy.private_key_from_bytes(Proxy.from_hex(privateKey));
    let capsule = Proxy.capsule_from_bytes(Proxy.from_hex(obj.key));
    var symKey = Proxy.decapsulate(capsule, priKey);

    var key = CryptoJS.enc.Utf8.parse(Proxy.to_hex(symKey.to_bytes()));
    var decrypted = CryptoJS.AES.decrypt(obj.cipher, key, options);

    return decrypted.toString(CryptoJS.enc.Utf8);

}

function GenerateReEncrytionKey(privateKey, publicKey) {
    let priKey = Proxy.private_key_from_bytes(Proxy.from_hex(privateKey));
    let pubKey = Proxy.public_key_from_bytes(Proxy.from_hex(publicKey));

    var rk = Proxy.generate_re_encryption_key(priKey, pubKey);
    return Proxy.to_hex(rk.to_bytes())
}
function ReEncryption(Rk, obj) {
    let rk = Proxy.re_encryption_key_from_bytes(Proxy.from_hex(Rk));
    let capsule = Proxy.capsule_from_bytes(Proxy.from_hex(obj.key));
    let re_capsule = Proxy.re_encrypt_capsule(capsule, rk);
    obj.key = Proxy.to_hex(re_capsule.to_bytes())
}

module.exports = {
    EncryptData,
    DecryptData,
    GenerateReEncrytionKey,
    ReEncryption,
    Proxy
}
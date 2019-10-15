const Proxy = require("./index").Proxy;
const PRE = require("./index");
function test() {
    var kp_A = Proxy.generate_key_pair();
    var sk_A = Proxy.to_hex(kp_A.get_private_key().to_bytes());
    var pk_A = Proxy.to_hex(kp_A.get_public_key().to_bytes());

    var kp_B = Proxy.generate_key_pair();
    var sk_B = Proxy.to_hex(kp_B.get_private_key().to_bytes());
    var pk_B = Proxy.to_hex(kp_B.get_public_key().to_bytes());

    let obj = PRE.EncryptData(pk_A, "test data")
    console.log(obj)
    let rk = PRE.GenerateReEncrytionKey(sk_A, pk_B);
    PRE.ReEncryption(rk, obj)

    let decryptData = PRE.DecryptData(sk_B, obj)
    console.log(decryptData)
}
test()
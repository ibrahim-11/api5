const argon2  = require("argon2");

class Jwt{

    static prefix = '$argon2id$v=19$m=1024,t=2,p=2$';

    static async create(payload){
        payload = Buffer.from(JSON.stringify(payload)).toString("base64");
        let signature = await argon2.hash(payload,{
            type: argon2.argon2id,
            memoryCost: 1024,
            parallelism: 2,
            timeCost: 2
          })
        let token = payload + "$" + signature.replace(this.prefix,'')
        return token;
    }

    static verify(token){

        return false;
    }

}

module.exports = Jwt;
const crypto = require('crypto')

function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.handler = async (event) => {
    
    var encoded = event.queryStringParameters.encoded
    var solution = decrypt(encoded)

    const response = {
        statusCode: 200,
        body: solution
    };
    return response;
};

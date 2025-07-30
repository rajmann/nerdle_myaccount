const crypto = require('crypto')

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.handler = async (event) => {
    
    var encoded = ""
    if (event.queryStringParameters.solution) {
      var solution = event.queryStringParameters.solution
      encoded = encrypt(solution)
    }

    if (event.queryStringParameters.solutionList) {
      var solutionList = event.queryStringParameters.solutionList
      // separate solutions by comma
      var solutions = solutionList.split(",")
      var encodedSolutions = []
      for (var i = 0; i < solutions.length; i++) {
        encodedSolutions.push(encrypt(solutions[i]))
      }
      encoded = encodedSolutions.join(",")
    }
    
    const response = {
        statusCode: 200,
        body: encoded,
    };
    return response;
};

const bittrex = require('node.bittrex.api')

/*bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET, 
})*/


module.exports = function(first, second){
    return new Promise((resolve, reject) => {
        const url = `https://bittrex.com/api/v1.1/public/getticker?market=${first}-${second}`
        bittrex.sendCustomRequest(url, (data, err) => {
            if(err) throw new Error(err)
            //TODO try catch
            resolve(data.result.Bid)
        })
    })
}
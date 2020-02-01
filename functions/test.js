var request = require('request');
var text ='putain';
        
var ran = Math.floor((10) * Math.random());
var options = {
    method: 'GET',
    url: 'https://mashape-community-urban-dictionary.p.rapidapi.com/define',
    qs: {term: `${text}`},
    headers: {
      'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
      'x-rapidapi-key': '150ec41dbcmsh0524350c3406a72p1fc807jsnbd8c05b29ec9'
    }
  };
  
  // eslint-disable-next-line prefer-arrow-callback
  request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
    // for(var i = 5; i < 60; i++){
    //     text += body[i];
        
    // }
    //console.log(text);
    //console.log(response)
    const obj = JSON.parse(body);
    //console.log(obj.list[]);
    console.log(obj.list[ran].definition);
  });
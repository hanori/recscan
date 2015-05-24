var util    = require("util");
var http = require('http');
var https   = require('https');
var urlutil = require('url');
var url_util = require('url');

var Iconv   = require("iconv").Iconv;
var cheerio = require('cheerio')
var charsetDetector = require("node-icu-charset-detector");

var profiles = require('./profiles');

var CharsetMatch    = charsetDetector.CharsetMatch;
var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Chrome/33.0.1750.117 Safari/534.57.2';

var getWebPageTitle = function(url, callback) {
  var urlElements = url_util.parse(url, false);
  var requester = (urlElements.protocol === 'https:') ? https : http;

  var options = {
    host: urlElements.hostname,
    port: urlElements.port,
    path: urlElements.path,
    headers: {'user-agent': ua }
  };

  var request = requester.get(options, function(response) {
    var binaryText = '';
    response.setEncoding('binary');

    response.on('data', function(chunk) {
      binaryText += chunk
    });

    response.on('end',function() {
      var textBuffer = new Buffer(binaryText, 'binary');
      var charsetMatch = new CharsetMatch(textBuffer);
      var text = bufferToString(textBuffer, charsetMatch.getName());
      //console.log(text);
      var $ = cheerio.load(text);

      //var title = $('title').text().replace(/\n/g, '');
      //var title = getElementById("empty-message-container").innerHTML;
      //var title = $('#empty-message-container').text().replace(/\n/g, '');
      //var title = $('#rhs').text().replace(/\n/g, '');
      //var title = $('#rhs').text();
      
      //店名検索
      //var title = $('.kno-ecr-pt').text();
      //var title = $('#rhs_block').children('.ol').children('.li').text();
      //var title = $('#rhs_block').children('ol').children('li').children('div').children('div').children('span').text();
      //var title = $('#rhs_block').find('span').text();
      //$('#rhs_block').children(1).contents().each(function (i, elem) {
      var elements = [];
      var elindex = 0;
      var splitvar = [];
      var buff;
      $('#rhs_block').children(1).contents().each(function (i, elem) {
        buff = $(this).text().replace(/\n/g, '');
        //buff
        splitvar = buff.split('電話:');
        //console.log(splitvar.toString());
        elements = splitvar[0].split('住所:');
        console.log(elements[1]);
        // if ( splitvar.length )
        // {
        //   console.log(splitvar[1]);
        //   elements[elindex] = splitvar[1];
        // }
        // splitvar = buff.split('電話:');
        // if ( splitvar.length )
        // {
        //   console.log(splitvar[1]);
        //   elindex++;
        //   elements[elindex] = splitvar[1];
        // }
      });
      //var title = elements.join(' : ');
      var title = elements[0];
      //console.log(title);
      //var rhs = $('u_account');
      //console.log(rhs);
      var astitle = (title === '') ? util.format("couldn't find title from %s", url) : astitle;
      //var rhs = (rhs === '') ? util.format("couldn't find rhs from %s", url) : rhs;

      callback(title);
      //callback(rhs);
    });
  });
  request.setTimeout(2000, function() {
    request.abort()
  });
  request.on('error', function(error) {
    callback(util.format("couldn't fetch web page from %s", url));
  });
};

var bufferToString = function(buffer, charset) {
  try {
    return buffer.toString(charset);
  } catch(error) {
    var charsetConverter = new Iconv(charset, "utf8");
    return charsetConverter.convert(buffer).toString();
  }
};

http.createServer(function (request, response) {
	var urlObj = urlutil.parse(request.url, true);
	var cb = urlObj.query.callback;
	var who = urlObj.query.who;
	console.log(who);
	var proflile;
	if ( cb && who ) {
		proflile = cb + "(" + JSON.stringify(profiles[who]) + ")";
		
		var url_val = "https://www.google.co.jp/search?q=03-5669-4480&qscrl=1";
		getWebPageTitle(url_val, function(title) {
		  console.log(title);
		});

		response.end(proflile);
	}
  //response.writeHead(200, {'content-Type': 'text/html'});
  //response.end('abcd');
  //response.text.prototype()
  //response(toLocaleString().split(pattern));
  //console.log(response([string]))
}).listen(8080);

var util    = require("util");
var urlutil = require("url");
var http    = require('http');
var https   = require('https');
var Iconv   = require("iconv").Iconv;
var cheerio = require('cheerio')

var charsetDetector = require("node-icu-charset-detector");
var CharsetMatch    = charsetDetector.CharsetMatch;
var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Chrome/33.0.1750.117 Safari/534.57.2';

var getWebPageTitle = function(url, callback) {
  var urlElements = urlutil.parse(url, false);
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
      var title = $('#rhs').text();
      //console.log(title);
      //var rhs = $('u_account');
      //console.log(rhs);
      var title = (title === '') ? util.format("couldn't find title from %s", url) : title;
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
    charsetConverter = new Iconv(charset, "utf8");
    return charsetConverter.convert(buffer).toString();
  }
};

var url = process.argv[2];
getWebPageTitle(url, function(title) {
  console.log(title);
});

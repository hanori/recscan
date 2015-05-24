var scraper = require('scraper');
var charsetDetector = require("node-icu-charset-detector");

scraper('https://www.google.co.jp/search?q=047-437-6266&oq=047-437-6266&aqs=chrome.0.69i59j69i60l2.2939j0j7&sourceid=chrome&es_sm=91&ie=UTF-8&qscrl=1', function(err, $) { 
//scraper('http://www.jpnumber.com/numberinfo_04_7188_5881.html', function(err, $) { 
/*scraper(encodeURI('http://www.google.co.jp/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=' + '047-399-9668'), function(err, $) { */
  if (err) {throw err;}
  console.log($('html').html());
  $('a').remove();
  /*var ans = $('html').html().match(/リクルート|recurute/ig).length;*/
  //var ans = $('html').html().match('/千葉県我孫子市中峠台11-5/ig).length;
  //console.log($('html').html().innerText());
  //console.log($('html').html());
  confirm("message");
  console.log("testだよ");
  console.log(ans);
});
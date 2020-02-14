const puppeteer = require('puppeteer');
const $ = require('cheerio');
function sleep(ms){
  return new Promise(resolve => {
      setTimeout(resolve, ms)
  });
}
async function printConsole(content) {
  const body = $.load(content);
  const anchorsSelector = '.today .no_today .no_up';
  var anchors = [];
  var title, price, url, elA;
  body(anchorsSelector).each(function() {
    anchors.push($(this));
  });
  if (anchors.length > 0) {
    var i = 0;
    for (const el of anchors) {
      elA = el.children("a.tit");
      title = elA.text().trim();
      url = elA.attr("href");
      price = el.find(".no_up ").text().trim();
      //console.log(title + "(" + price + ")" + " - " + url);
      console.log(title + "(" + price + ")");
      i++;
      if (i < anchors.length)
        await sleep(1000);
    }
  }
}
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://finance.naver.com/item/main.nhn?code=005930", { waitUntil : "networkidle2" });
  const content = await page.content();
  await printConsole(content);
  await browser.close();
})();

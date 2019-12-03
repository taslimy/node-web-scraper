const request = require("request-promise");
const cheerio = require("cheerio");

const URL = "https://www.imdb.com/title/tt0102926/";

(async () => {
  const res = await request({
    uri: URL,
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language":
        "en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      Host: "www.imdb.com",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
    },
    gzip: true
  });

  let $ = cheerio.load(res);

  let title = $('div[class="title_wrapper"] > h1').text();
  let rating = $('span[itemprop="ratingValue"]').text();
  console.log(title, rating);
})();

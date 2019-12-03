const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

const URLS = [
  "https://www.imdb.com/title/tt0102926/",
  "https://www.imdb.com/title/tt2267998/"
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const res = await request({
      uri: movie,
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

    let title = $('div[class="title_wrapper"] > h1')
      .text()
      .trim();
    let rating = $('span[itemprop="ratingValue"]').text();
    let poster = $('div[class="poster"] > a > img').attr("src");
    let totalRating = $('span[itemprop="ratingCount"]').text();
    let releaseDate = $('div[class="subtext"] > a:last-child')
      .text()
      .trim();

    let genres = [];

    $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each(
      (i, el) => {
        let genre = $(el).text();

        genres.push(genre);
      }
    );

    moviesData.push({
      title,
      rating,
      poster,
      totalRating,
      releaseDate,
      genres
    });
  }

  fs.writeFileSync("./data.json", JSON.stringify(moviesData), "utf-8");

  console.log(moviesData);
})();

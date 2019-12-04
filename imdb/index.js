const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const URLS = [
  {
    url: "https://www.imdb.com/title/tt0102926/",
    id: "the_silence_of_the_lambs"
  },
  { url: "https://www.imdb.com/title/tt2267998/", id: "gone_girl" }
];

(async () => {
  let moviesData = [];

  for (let movie of URLS) {
    const res = await requestPromise({
      uri: movie.url,
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
    let popular = $(
      "#title-overview-widget > div.plot_summary_wrapper > div.titleReviewBar > div:nth-child(5) > div.titleReviewBarSubItem > div:nth-child(2) > span"
    )
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

    let file = fs.createWriteStream(`${movie.id}.jpg`);

    await new Promise((resolve, reject) => {
      let stream = request({
        uri: poster,
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language":
            "en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3",
          "Cache-Control": "max-age=0",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
        },
        gzip: true
      })
        .pipe(file)
        .on("finish", () => {
          console.log(`${movie.id} finished downloading images`);
          resolve();
        })
        .on("error", error => {
          reject(error);
        });
    }).catch(error => {
      console.log(`${movie.id} has an error on download. ${error}`);
    });
  }

  // fs.writeFileSync("./data.json", JSON.stringify(moviesData), "utf-8");
  // console.log(moviesData)
})();

// promise example

// try {
// let test = await new Promise((resolve, reject) => {
//       let is_home = true;
//       if (is_home) {
//         resolve('its resolving');
//       } else {
//         reject('its false');
//       }
//     });
//   } catch(error) {
//     console.log(error)
//   }

// attach a proxy server.

// const request = require("request-promise").defaults({
//   proxy: "http://username:password@ip:port"
// });

// (async () => {
//   let res = await request("https://httpbin.org/ip");

//   debugger;
// })();

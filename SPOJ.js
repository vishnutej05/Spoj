const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

(async () => {
  const baseUrl = "https://www.spoj.com/status/bhargavdh5/all/start=";
  const results = [];

  let start = 0;

  while (true) {
    const nextPageUrl = baseUrl + start;
    const response = await axios.get(nextPageUrl);
    const html = response.data;

    const $ = cheerio.load(html);

    const problemRows = $(".kol1")
      .map((index, element) => {
        const timestamp = $(element).find(".status_sm span").attr("title");
        const problemLink = $(element).find(".sproblem a");
        const problemName = problemLink.text().trim();
        const problemUrl = problemLink.attr("href");
        const formattedTimestamp = moment(timestamp).format("DD/MM/YYYY");

        return {
          time: formattedTimestamp,
          name: problemName,
          link: `https://www.spoj.com${problemUrl}`,
        };
      })
      .get();

    if (problemRows.length === 0) {
      // If no more problem rows found, break the loop
      break;
    }

    results.push(...problemRows);
    start += 20; // Increment start index for the next page
  }

  console.log(results);
})();

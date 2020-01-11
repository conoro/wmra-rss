// WMRA RSS - Copyright Conor O'Neill 2020, conor@conoroneill.com
// LICENSE Apache-2.0
// Invoke like https://url.of.serverless.function/dev/rss

module.exports.check = (event, context, callback) => {
  var request = require("request");
  var cheerio = require("cheerio");
  var RSS = require("rss");
  var URL = "http://www.wmra.info/news";

  var feed = new RSS({
    title: "WMRA RSS",
    description: "Return latest news from the WMRA",
    feed_url: "http://example.com/rss.xml",
    site_url: URL,
    image_url:
      "./wmra.png",
    docs: "http://example.com/rss/docs.html",
    managingEditor: "conor@conoroneill.com",
    webMaster: "conor@conoroneill.com",
    copyright: "2020 Conor ONeill",
    language: "en",
    pubDate: "Jan 01, 2020 06:00:00 GMT",
    ttl: "60"
  });

  request(URL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      $(".uk-article").each(function () {
        var link = $(this).attr("data-permalink");
        var title = $(this).find(".uk-article-title").text() || "No title";
        var img = "http://www.wmra.info" + $(this).find("img").attr("data-src");
        var currentDate = new Date();
        var description = '<img src="' + img + '" alt="' + title + '" /> ' + $(this).find('[property="text"]').text()
        feed.item({
          title: title,
          description: description,
          url: link,
          author: "SCMP",
          date: currentDate
        });
      });
      var xml = feed.xml();
      context.succeed(xml);
    }
  });
};

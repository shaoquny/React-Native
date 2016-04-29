var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var xxxiaoUrl = 'http://m.xxxiao.com/';

var TopicUrls = [];
var CurrentPage = 0;

var fetchTopicUrl = function(topicUrl, callback) {
  console.log(topicUrl);
  superagent.get(topicUrl)
    .end(function (err, res) {
      if (err) {
        return console.error(err);
      }
      var $ = cheerio.load(res.text);
      // 获取首页所有的链接
      var topicList = [];
      $('article .thumb-link').each(function (idx, element) {
      var topic = {};
        var $element = $(element);
        var href = url.resolve(xxxiaoUrl, $element.attr('href'));
        var $nextImg = $element.children('img');
        var img = url.resolve(xxxiaoUrl, $nextImg.attr('src'));
        topic.url = href;
        topic.img = img;
        topicList.push(topic);
      });
      TopicUrls.push(topicList);
      var $element = $('div.nav-previous a');
      var href = $element.attr('href');
      if (href != null) {
        var href = url.resolve(xxxiaoUrl, href);
        fetchTopicUrl(href, callback);
      }else {
        console.log(TopicUrls);
        callback();
      }
  });
};

fetchTopicUrl(xxxiaoUrl, function() {});

var fetchUrl = function (picUrl, callback) {
  superagent.get(picUrl)
    .end(function(err, res) {
      var PicUrls = [];
      if (err) {
        callback(err, []);
      }
      var $ = cheerio.load(res.text);
      $('div.rgg_imagegrid a').each(function (idx, element) {
        var $element = $(element);
        var href = url.resolve(picUrl, $element.attr('href'));

        PicUrls.push(href);
      });
      callback(null, PicUrls);
    });
};

var app = express();
app.get('/', function(req, res) {
  console.log(req.ip);
  var type = parseInt(req.query.type);
  switch(type) {
    case 0: {
      var page = parseInt(req.query.page);
      CurrentPage = (page+TopicUrls.length)%TopicUrls.length;
      res.send({
        page : CurrentPage,
        data : TopicUrls[CurrentPage]
      });
      break;
    }
    case 1: {
      fetchUrl(req.query.url, function(err, urls) {
        if (err) {
          console.log(err);
        }
        res.send(urls);
      });
      break;
    }
    case 2: {
      fetchTopicUrl(xxxiaoUrl, function() {
        res.send({
          page : CurrentPage,
          data : TopicUrls[CurrentPage]
        });
      });
      break;
    }
    default:
      break;
  }
});
app.listen(8082);








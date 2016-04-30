var superagent = require('superagent');
var cheerio = require('cheerio');
var express = require('express');
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url');

var config = require('./config');
var ServerConfig = config.ServerConfig;
var ScrapXXXiaoConfig = config.ScrapXXXiaoConfig;
var RequestType = ScrapXXXiaoConfig.RequestType;

var XXXiao = require('./xxxiao_scraping').XXXiao;

// 服务器启动时预先抓取妹子列表
XXXiao.RefreshGrilsList(null);

// 创建并启动http服务
var app = express();
app.get('/', function(req, res) {
  console.log(req.ip);
  var type = parseInt(req.query.type);
  switch(type) {
    // 获取妹子列表，分页获取
    case RequestType.GrilsList: {
      var page = parseInt(req.query.page);
      XXXiao.GetGirlsList(page, function(data) {
        res.send(data);
      });
      break;
    }
    // 获取某个妹子的图片列表，通过妹子url获取
    case RequestType.GrilPicList: {
      XXXiao.FetchGirlPicList(req.query.url, function(err, picUrls) {
        if (err) {
          console.log(err);
          res.send(err);
        }else {
          res.send(picUrls);
        }
      });
      break;
    }
    // 刷新服务端妹子列表
    case RequestType.RefreshGrilsList: {
      XXXiao.RefreshGrilsList(function(err) {
        if (err) {
          res.send(err);
        }else {
          XXXiao.GetGirlsList(0, function(data){
            res.send(data);
          });
        }
      });
      break;
    }
    default:
    {
      res.send('Err: Wrong request type');
      break;
    }
  }
});
app.listen(ServerConfig.ServerPort);








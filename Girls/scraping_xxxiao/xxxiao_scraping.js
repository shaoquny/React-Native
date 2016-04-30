var superagent = require('superagent');
var cheerio = require('cheerio');
// url 模块是 Node.js 标准库里面的
var url = require('url');

var ScrapXXXiaoConfig = require('./config').ScrapXXXiaoConfig;

var XXXiao = {
	GirlsList : [],

	// 获取妹子列表，分页获取
	GetGirlsList : function(page, callback) {
		page = (page+this.GirlsList.length)%this.GirlsList.length;
		var data = {
			page : page,
			data : this.GirlsList[page]
		};
		callback(data);
	},

	// 获取某个妹子的图片列表，通过妹子url获取
	FetchGirlPicList : function (girlUrl, callback) {
	  superagent.get(girlUrl)
	    .end(function(err, res) {
	      var picUrlList = [];
	      if (err) {
	        callback(err, []);
	      }
	      var $ = cheerio.load(res.text);
	      $('div.rgg_imagegrid a').each(function (idx, element) {
	        var $element = $(element);
	        var href = url.resolve(ScrapXXXiaoConfig.ScrapUrl, $element.attr('href'));
	        picUrlList.push(href);
	      });
	      callback(null, picUrlList);
	    });
	},

	// 刷新服务端妹子列表
	RefreshGrilsList : function(callback) {
		this.GirlsList = [];
		this.FetchGirlsList(ScrapXXXiaoConfig.ScrapUrl, callback);
	},

	// 获取所有妹子列表
	FetchGirlsList : function(pageUrl, callback) {
		var that = this;
	  console.log(pageUrl);
	  superagent.get(pageUrl)
		.end(function (err, res) {
		  if (err) {
		  	if (callback) {
		  		callback(err);
		  	}
				return console.error(err);
		  }
		  var $ = cheerio.load(res.text);
		  // 获取首页所有的链接
		  var girlsListPaged = [];
		  $('article .thumb-link').each(function (idx, element) {
			  var girlData = {};
				var $element = $(element);
				var href = url.resolve(ScrapXXXiaoConfig.ScrapUrl, $element.attr('href'));
				var $nextImg = $element.children('img');
				var img = url.resolve(ScrapXXXiaoConfig.ScrapUrl, $nextImg.attr('src'));
				girlData.url = href;
				girlData.img = img;
				girlsListPaged.push(girlData);
		  });
		  that.GirlsList.push(girlsListPaged);
		  var $element = $('div.nav-previous a');
		  var href = $element.attr('href');
		  if (href != null) {
				var href = url.resolve(ScrapXXXiaoConfig.ScrapUrl, href);
				that.FetchGirlsList(href, callback);
		  }else {
				console.log(that.GirlsList);
				if (callback) {
		  		callback(null);
		  	}
		  }
	  });
	}
}

exports.XXXiao = XXXiao;
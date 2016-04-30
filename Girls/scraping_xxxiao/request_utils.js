var config = require('./config');
var ServerConfig = config.ServerConfig;
var RequestType = config.ScrapXXXiaoConfig.RequestType;

var ServerUtil = {
	ServerUrl : ServerConfig.GetRequestUrl(),
	// 获取妹子列表，分页获取
	GetRequestGirlsListUrl : function(page) {
		var reqUrl = this.ServerUrl + 'type=' + RequestType.GrilsList + '&page=' + page;
		return reqUrl;
	},
	// 获取某个妹子的图片列表，通过妹子url获取
	GetRequestGirlListUrlByUrl : function(url) {
		var reqUrl = this.ServerUrl + 'type=' + RequestType.GrilPicList + '&url=' + url;
		return reqUrl;
	},
	// 刷新服务端妹子列表
	GetRefreshGirlsListUrl : function() {
		var reqUrl = this.ServerUrl + 'type=' + RequestType.RefreshGrilsList;
		return reqUrl;
	}
}

exports.ServerUtil = ServerUtil;
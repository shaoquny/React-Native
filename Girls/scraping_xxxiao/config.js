var ServerConfig = {
	ServerUrl : 'http://127.0.0.1',
	ServerPort : 8082,
	ServerPath : '/?',

	GetRequestUrl : function() {
		return this.ServerUrl + ':' + this.ServerPort + this.ServerPath;
	}
}

var ScrapXXXiaoConfig = {
	ScrapUrl : 'http://m.xxxiao.com/',
	AppPort : ServerConfig.ServerPort,
	RequestType : {
		GrilsList : 0,
		GrilPicList : 1,
		RefreshGrilsList : 2
	}
}

exports.ServerConfig = ServerConfig;
exports.ScrapXXXiaoConfig = ScrapXXXiaoConfig;
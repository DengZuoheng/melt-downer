
class BaseSearchURLGenerater {
    constructor() {

        if (this.getBaseSearchURL === undefined) {
            throw new TypeError("Must override method");
        }
        if (this.customParseParam === undefined) {
            throw new TypeError("Must override method");
        }
        if (this.engineName === undefined) {
            throw new TypeError("Must override method");
        }
        if (this.getParamAlias === undefined) {
            throw new TypeError("Must override method");
        }
        this.searchArg = "q";
    }

    genURL(args) {
        var baseURL = this.getBaseSearchURL();
        var urlParams = {}
        var keywords = [];
        for (var key of args) {
            var param = this.parseParam(key);
            if (param['isParam']) {
                urlParams[param['paramKey']] = param['paramValue'];
            } else {
                keywords.push(key);
            }
        }
        let paramURL = this.genParamURL(urlParams);
        let keywordURL = this.genKeywordURL(keywords);
        return baseURL + "?" + keywordURL + "&" + paramURL;
    }

    genKeywordURL(keywords) {
        var encoded = [];
        for (var keyword of keywords) {
            encoded.push(encodeURIComponent(keyword));
        }
        return this.searchArg + "=" + encoded.join("+");
    }

    genParamURL(params) {
        console.log(params);
        let ret = "";
        for (var key of Object.keys(params)) {
            ret += key + "=" + params[key] + "&";
        }
        return ret;
    }

    parseParam(key) {
        let param = this.customParseParam(key);
        if (param['isParam']) {
            return param;
        }
        param['isParam'] = false;
        if (key.indexOf(":") != -1) {
            let struct = key.split(":");
            let paramKey = "";
            let paramValue = "";
            if (struct.length == 2) {
                paramKey = struct[0];
                paramValue = struct[1];
                try {
                    paramKey = this.getParamAliasKey(paramKey);
                    paramValue = this.getParamAliasValue(paramKey, paramValue);
                    param['paramKey'] = paramKey;
                    param['paramValue'] = paramValue;
                    param['isParam'] = true;
                } catch (e) {

                }

            }

        }
        return param;

    }
    getParamAliasKey(key) {
        let alias = this.getParamAlias()["keys"];
        return alias[key];
        
    }
    getParamAliasValue(key, value) {
        let alias = this.getParamAlias()["values"][key];
        return alias[value];
    }
}

class GoogleSearchURLGenerater extends BaseSearchURLGenerater {
    constructor(kwrags) {
        super();
    }
    getBaseSearchURL() {
        return "https://www.google.com/search";
    }

    customParseParam(key) {
        return {
            "isParam" : false,
        };
    }

    engineName() {
        return "google";
    }

    getParamAlias() {
        return {
            "keys" : {
                "s" : "as_sitesearch",
                "site" : "as_sitesearch",
                "lang" : "lr",
                "f" : "as_filetype",
                "file" : "as_filetype",
                "filetype" : "as_filetype",
                "time" : "as_qdr",
                "last" : "as_qdr",
            }, // keys
            "values" : {
                "as_sitesearch" : {
                    "so" : "stackoverflow.com",
                    "zhihu" : "zhihu.com",
                    "git" : "github.com"
                },
                "lr" : {
                    "chs" : "lang_zh-CN",
                    "cht" : "lang_zh-TW",
                    "jp" : "lang_ja",
                    "eng" : "lang_en",
                },
                "as_qdr" : {
                    "week" : "w1",
                    "year" : "y1",
                    "month" : "m1",
                    "day" : "d1",
                    "2day" : "d2",
                    "w" : "w1",
                    "y" : "y1",
                    "m" : "m1",
                    "24h" : "h24",
                    "1week" : "w1",
                    "1year" : "y1",
                    "1month" : "m1",
                },
                "as_filetype" : {
                    "bt" : "torrent",
                },

            }, // values
        };
    }
}

class BingSearchURLGenerater extends BaseSearchURLGenerater {
    constructor(kwrags) {
        super();
    }
    getBaseSearchURL() {
        return "https://www.bing.com/search";
    }

    customParseParam(key) {
        return {
            "isParam" : false,
        };
    }

    engineName() {
        return "bing";
    }

    getParamAlias() {
        return {
            "keys" : {}, // keys
            "values" : {}, // values
        };
    }
}

class BaiduSearchURLGenerater extends BaseSearchURLGenerater {
    constructor(kwrags) {
        super();
        this.searchArg = "q1";
    }
    getBaseSearchURL() {
        return "https://www.baidu.com/s";
    }

    customParseParam(key) {
        return {
            "isParam" : false,
        };
    }

    engineName() {
        return "bing";
    }

    getParamAlias() {
        return {
            "keys" : {}, // keys
            "values" : {}, // values
        };
    }
}

function getSearchURL(text) {
    globalEngineAlias = {
        "go" : "google",
        "bing" : "bing",
        "baidu" : "baidu"
    }

    globalEngineArgs = {
        "google" : {

        },
        "bing" : {

        },
        "baidu" : {

        }
    }
    var args = text.split(" ");
    var filterd = [];
    var engine = "google";
    var engineArgs = {};
    for (var arg of args) {
        if (arg[0] == "@") {
            engine = arg.replace("@", "");
            engine = globalEngineAlias[engine];
            engineArgs = globalEngineArgs[engine];
        } else {
            filterd.push(arg);
        }
    }
    var generator = null;
    if (engine == "google") {
        generator = new GoogleSearchURLGenerater(engineArgs);
    } else if (engine == "bing") {
        generator = new BingSearchURLGenerater(engineArgs);
    } else if (engine == "baidu") {
        generator = new BaiduSearchURLGenerater(engineArgs);
    }
    if (generator) {
        return generator.genURL(filterd);
    } else {
        return 'https://www.google.com/search?q=' + encodeURIComponent(text);
    }
    
}

chrome.omnibox.onInputEntered.addListener(
    function(text) {
        var newURL = getSearchURL(text);
        chrome.tabs.create({ url: newURL });
});




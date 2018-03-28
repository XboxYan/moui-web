// A7://10.9.216.15:8080/getColumns
const A7 = {
    portalId: "1",
    account: "0",
    client: "0",
    URL_MAP: {
        getColumns: {
            name: 'GetFolderContents',
            data: function (p) {
                return '<GetFolderContents assetId="' + p.columnId + '" includeSubFolder="Y"' + this._pageCommon(1, 9999) + '/>';
            },
            parse: function (datas, ret) {
                const list = datas.childFolderList;
                ret.result = list || [];
            }
        },
        getAssets: {
            name: 'GetFolderContents',
            data: function (p) {
                return '<GetFolderContents mergeTV="1" includeSelectableItem="Y" assetId="' + p.columnId + '"' + this._pageCommon(p.page, p.pageSize) + '/>';
            },
            parse: function (datas, ret, prefix) {
                const list = datas.selectableItemList;
                ret.result = list || [];
                for (var i = 0; i < ret.result.length; i++) {
                    var item = ret.result[i];
                    if (item.imageList && item.imageList.length > 0) {
                        item.poster = prefix + item.imageList[0].posterUrl;
                    }
                    item.imageList = null;
                }
            },
        },
        getDetail: {
            name: 'GetItemData',
            data: function (p) {
                return '<GetItemData titleProviderId="' + p.providerId + '" titleAssetId="' + p.assetId + '"' + this.common() + '/>'
            },
            parse: function (datas, ret, prefix) {
                const det = datas.selectableItem;
                ret.result = det || {};
                var item = ret.result;
                if (item.imageList && item.imageList.length > 0) {
                    item.poster = prefix + item.imageList[0].posterUrl;
                }
                item.imageList = null;
            }
        },
        getRelateList: {
            name: 'GetAssociatedFolderContents',
            data: function (p) {
                return '<GetAssociatedFolderContents mergeTV="1" quickId="' + p.assetId + '" targetLabel="A" associatedType="4"' + this._pageCommon(p.page, p.pageSize) + '/>'
            },
            parse: function (datas, ret, prefix) {
                const list = datas.selectableItem;
                ret.result = list || [];
                for (var i = 0; i < ret.result.length; i++) {
                    var item = ret.result[i];
                    if (item.imageList && item.imageList.length > 0) {
                        item.poster = prefix + item.imageList[0].posterUrl;
                    }
                    item.imageList = null;
                }
            }
        }
    },
    common: function () {
        return ' client="' + this.client + '" account="' + this.account + '" portalId="' + this.portalId + '" ';
    },
    isA7: function (url) {
        return url && url.substring(0, 2) === 'A7';
    },
    request: function (obj) {
        const url = obj.url;
        const http = url.replace('A7', 'http');
        const urlIndex = http.lastIndexOf('/') + 1;
        const paramsIndex = http.indexOf('?');
        const prefix = http.substring(0, urlIndex);
        const type = http.substring(urlIndex, paramsIndex);
        const params = this._resolveParams(http.substring(paramsIndex + 1));
        const body = this.URL_MAP[type];

        this._ajaxA7({
            prefix: prefix,
            url: prefix + body.name,
            origin: url,
            page: params.page,
            pageSize: params.pageSize,
            data: body.data.call(this, params),
            parse: body.parse,
            finish: obj.success,
            error: obj.error,
            context: obj.context,
        })
    },
    _resolveParams: function (params) {
        const result = {};
        if (params) {
            const ps = params.split('&');
            for (var i = 0; i < ps.length; i++) {
                const pair = ps[i].split('=');
                result[pair[0]] = pair[1];
            }
        }
        return result;
    },
    _ajaxA7: function (obj) {
        obj.xml = true;
        obj.url = obj.url + '?dataType=JSON';
        obj.type = 'POST';
        const _self = this;
        obj.success = function (result) {
            if (!obj.finish) {
                return;
            }
            var ret = _self._response.call(_self, result);
            obj.parse && ret.success && obj.parse.call(_self, result, ret, obj.prefix);
            if (ret.success && obj.page) {
                ret.page = obj.page;
                ret.pageSize = obj.pageSize;
                const total = parseInt(result.totalResults,10);
                ret.totalCount = Math.max(total, ret.result.length);
            }
            obj.finish.call(obj.context || _self, ret);
        }
        ajaxM(obj);
    },
    _response: function (datas) {
        if (!datas) {
            return { success: false, desc: 'unknow error' };
        }
        if (datas.code) {
            return { success: false, desc: datas.code + ': ' + datas.message };
        }
        return { success: true };
    },
    _pageCommon: function (page, pageSize) {
        return ' startAt="' + (1 + (page - 1) * pageSize) + '" maxItems="' + pageSize + '"' + this.common();
    }
}

// request({
//     url: 'A7://10.9.216.15:8080/getColumns?columnId=MANU6500842&page=1&pageSize=10',
//     success: function (datas) { console.log(datas); }
// })
// request({
//     url: 'A7://10.9.216.15:8080/getAssets?columnId=MANU0000000006500848&page=1&pageSize=10',
//     success: function (datas) { console.log(datas); }
// })
// request({
//     url: 'A7://10.9.216.15:8080/getDetail?providerId=hus&assetId=17121817080900204688',
//     success: function (datas) { console.log(datas); }
// })
// request({
//     url: 'A7://10.9.216.15:8080/getRelateList?assetId=TWSX1513927660662880&page=1&pageSize=10',
//     success: function (datas) { console.log(datas); }
// })

// url : data
var networkCache = {};

function request(obj) {
    if (A7.isA7(obj.url)) {
        A7.request(obj);
    } else {
        ajaxM(obj);
    }
}

function ajaxM(obj) {
    if (!obj.url) {
        return;
    }
    const _url = obj.url;
    var xmlhttp = new XMLHttpRequest();    //这里扩展兼容性
    var type = (obj.type || 'GET').toUpperCase();
    const _self = this;
    const cacheUrl = obj.origin || _url;
    if (networkCache[cacheUrl]) {
        obj.success.call(obj.context || _self, networkCache[cacheUrl]);
        obj.success = null;
    }
    xmlhttp.onreadystatechange = function () {    //这里扩展ajax回调事件
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200 && !!obj.success) {
            if (xmlhttp.responseText) {
                const result = JSON.parse(xmlhttp.responseText);
                networkCache[cacheUrl] = result;
                obj.success.call(obj.context || _self, result);
            } else {
                obj.error.call(obj.context || _self, 'empty response');
            }
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status !== 200 && !!obj.error) {
            obj.error.call(obj.context || _self, 'error httpCode:' + xmlhttp.status);
        }
    };
    if (type === 'POST') {
        xmlhttp.open(type, _url, obj.async || true);
        if (obj.xml) {
            xmlhttp.setRequestHeader('Content-type', 'text/xml');
            xmlhttp.send(obj.data);
        } else {
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send(_params(obj.data || null));
        }
    }
    else if (type === 'GET') {
        xmlhttp.open(type, _url + (obj.data ? ('?' + _params(obj.data || null)) : ''), obj.async || true);
        xmlhttp.send(null);
    }
}

//_params函数解析发送的data数据，对其进行URL编码并返回
function _params(data, key) {
    var params = '';
    key = key || '';
    var type = { 'string': true, 'number': true, 'boolean': true };
    if (type[typeof (data)])
        params = data;
    else
        for (var i in data) {
            if (type[typeof (data[i])])
                params += "&" + key + (!key ? i : ('[' + i + ']')) + "=" + data[i];
            else
                params += _params(data[i], key + (!key ? i : ('[' + i + ']')));
        }
    return !key ? encodeURI(params).replace(/%5B/g, '[').replace(/%5D/g, ']') : params;
}

export { request };
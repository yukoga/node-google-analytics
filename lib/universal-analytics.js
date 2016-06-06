var hashmap = require('hashmap'),
    http = require('http'),
    uuid = require('node-uuid')
    ;

var tracker = function(tid) {
  this.params = new hashmap();
  this.params.set('v', 1);
  this.params.set('tid', tid);
  var prefix_cid = "rmktst_";
  var mycid = prefix_cid ? prefix_cid + uuid.v4() : uuid.v4();
  this.params.set('cid', uuid.v4());
  this.requestData = '';
}

tracker.prototype.sendPageview = function(path, title) {
  var vpath = path ? path : '/';
  var title = title ? title : vpath;
  this.setParams('t', 'pageview');
  this.setParams('dp', vpath);
  this.setParams('dt', title);
  this.send();
}

tracker.prototype.sendEvent = function(category, action, label, value, interaction) {
  var ni = ((interaction) && (interaction == 1)) ? 1 : 0 ;
  this.setParams('t', 'event');
  this.setParams('ec', category);
  this.setParams('ea', action);
  this.setParams('el', label);
  this.setParams('ev', value);
  this.setParams('ni', ni);
  this.send();
}

tracker.prototype.setHitCallback = function(func) {
  this.params.set('hitCallback', func);
}

tracker.prototype.getHitCallback = function() {
  return this.params.get('hitCallback');
}

tracker.prototype.setParams = function(key, value) {
  this.params.set(key, value);
}

tracker.prototype.getParams = function(key) {
  return this.params.get(key);
}

tracker.prototype.setClientId = function(value) {
  this.setParams('cid', value);
}

tracker.prototype.send = function() {
  var _self = this;
  var options = {
    host: 'www.google-analytics.com',
    path: '/collect',
    method: 'POST'
  }
  callback = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str+=chunk;
    });
    response.on('end', function() {
      console.log(str);
      console.log(_self.getHitCallback);
      if (_self.getHitCallback() && _self.getHitCallback() instanceof Function) {
        _self.getHitCallback().call({}, str);
      }
    });
  }


  var req = http.request(options, callback);
  req.write(this.buildRequest(this.params));
  req.end();
}

tracker.prototype.buildRequest = function(params) {
  var arr = new Array();
  params.forEach(function(value, key) { arr.push(key+'='+value); });
  return arr.join('&');
}

module.exports = tracker;

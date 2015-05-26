var hashmap = require('hashmap'),
    http = require('http'),
    uuid = require('node-uuid')
    ;

var tracker = function(tid) {
  this.params = new hashmap();
  this.params.set('v', 1);
  this.params.set('tid', tid);
  this.params.set('cid', uuid.v4());
}

tracker.prototype.sendPageview = function(path, title) {
  var vpath = path ? path : '/';
  var title = title ? title : vpath;
  this.setParams('t', 'pageview');
  this.setParams('dp', vpath);
  this.setParams('dt', title);
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
  req.write(this._params_join(this.params));
  req.end();
}

tracker.prototype._params_join = function(params, delimiter) {
  var _arr = new Array();
  params.forEach(function(value, key) { _arr.push(key+'='+value); });
  return _arr.join('&');
}

module.exports = tracker;

(function(exports) {
  var slice = [].slice,
      indexof = [].indexOf || function(needle) {
        var bits = this.slice();
        for(var i = this.length - 1; i > -1 && this[i] !== needle; --i);
        return i;
      },
      keys = Object.keys || function(obj) {
        var accum = [];
        for(var k in obj) if(obj.hasOwnProperty(k)) accum.push(k);
        return accum;
      };

  var Loop = function(rounding, easing) {
    this.keyframes = {};
    this.rounding = rounding || function(x) { return Math.round(x); };
    this.easing = easing || arguments.callee.easings.linear;
  };

  Loop.easings = {};
  Loop.easings.linear = function(current, duration) { return current / duration; };
  Loop.easings.cubic_in = function(current, duration) { return Math.pow(current/duration, 3); };
  Loop.easings.cubic_out = function(current, duration) { return 1 + (-1 * Math.pow(current/duration, 3)); };

  Loop.prototype.addKey = function(at, callback) {
    at = typeof at === 'string' ? parseInt(at.slice(0, -1)) : at;
    this.keyframes[at] = this.keyframes[at] || [];
    this.keyframes[at].push(callback);
  };

  Loop.prototype.removeKey = function(at, callback) {
    var keyframes = this.keyframes[at] || [],
        idx = indexof.call(keyframes, callback);

    callback ?
      idx !== -1 ?
        (keyframes.splice(idx, 1)) :
        (keyframes)                :
      (keyframes.length = 0);
  };

  Loop.prototype.getMap = function() {
    var _keys = keys(this.keyframes),
        out = {};

    for(var i = _keys.length - 1; i > -1; --i)
      out[_keys[i]] = this.keyframes[_keys[i]].slice();

    return out;
  };

  Loop.prototype.addMap = function(obj) {
    var _keys = keys(this.keyframes);
    for(var i = _keys.length - 1; i > -1; --i)
      for(var j = 0, len = obj[_keys[i]].length; j < len; ++j)
       this.addKey(_keys[i], obj[_keys[i]][j]); 
  };

  Loop.prototype.play = function(duration, callback) {
    callback && this.addKey('100%', callback);

    duration = ~~duration;

    if(duration === 0 || isNaN(duration))
      throw new Error('Cannot have zero or NaN as a duration.');

    var now = +(new Date()),
        last = now,
        elapsed = 0,
        paused = false,
        quit = false,
        _keys = (function(items) { for(var i = items.length-1; i > -1; --i) items[i] = ~~items[i]; return items; })(keys(this.keyframes)),
        idx = -1,
        nextIdx = 0,
        loop = this,
        ctls = {
          quit:function() { quit = true; },
          pause:function() { paused = true; },
          play:function() { paused = false; }
        },
        interval = setInterval(function() {
          try {
            if(paused) { 
              last = +(new Date()) - last;
            } else if(quit || idx === _keys.length - 1) {
              clearInterval(interval);
              return;
            } else {

              now = +(new Date());
              elapsed += now - last;
              last = now;

              var value = (loop.rounding(100 * loop.easing(elapsed, duration)));
              while(nextIdx < _keys.length && ~~_keys[nextIdx] <= value) {
                idx = nextIdx;

                for(var i = 0, len = loop.keyframes[_keys[idx]].length; i < len; ++i)
                  loop.keyframes[_keys[idx]][i](ctls);

                ++nextIdx;
              }
            }
          } catch(err) {
            typeof(console) !== 'undefined' && console.error(err);
            clearInterval(interval);
          }
        });
  };

  exports.loop = function(rounding, easing) {
    return new Loop(rounding, easing);
  };
  exports.loop.easings = Loop.easings;
})(typeof exports !== 'undefined' ? exports : (window.keyframely = {}));

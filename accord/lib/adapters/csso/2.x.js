// Generated by CoffeeScript 1.11.1
(function() {
  var Adapter, CSSO, W,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Adapter = require('../../adapter_base');

  W = require('when');

  CSSO = (function(superClass) {
    var compile;

    extend(CSSO, superClass);

    function CSSO() {
      return CSSO.__super__.constructor.apply(this, arguments);
    }

    CSSO.prototype.name = 'csso';

    CSSO.prototype.extensions = ['css'];

    CSSO.prototype.output = 'css';

    CSSO.prototype.isolated = true;

    CSSO.prototype._render = function(str, options) {
      if (options.restructuring == null) {
        options.restructuring = true;
      }
      if (options.debug == null) {
        options.debug = false;
      }
      return compile((function(_this) {
        return function() {
          return _this.engine.minify(str, options).css;
        };
      })(this));
    };

    compile = function(fn) {
      var err, res;
      try {
        res = fn();
      } catch (error) {
        err = error;
        return W.reject(err);
      }
      return W.resolve({
        result: res
      });
    };

    return CSSO;

  })(Adapter);

  module.exports = CSSO;

}).call(this);

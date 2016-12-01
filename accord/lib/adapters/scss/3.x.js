// Generated by CoffeeScript 1.11.1
(function() {
  var Adapter, SCSS, W, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Adapter = require('../../adapter_base');

  W = require('when');

  path = require('path');

  SCSS = (function(superClass) {
    extend(SCSS, superClass);

    function SCSS() {
      return SCSS.__super__.constructor.apply(this, arguments);
    }

    SCSS.prototype.name = 'scss';

    SCSS.prototype.extensions = ['scss', 'sass'];

    SCSS.prototype.output = 'css';

    SCSS.prototype.supportedEngines = ['node-sass'];

    SCSS.prototype._render = function(str, options) {
      var deferred;
      deferred = W.defer();
      if (options.sourcemap === true) {
        options.sourceMap = true;
        options.outFile = options.filename.replace('.scss', '.css');
        options.omitSourceMapUrl = true;
        options.sourceMapContents = true;
      }
      options.file = options.filename;
      options.data = str;
      this.engine.render(options, function(err, res) {
        var basePath, data;
        if (err) {
          return deferred.reject(err);
        }
        data = {
          result: String(res.css),
          imports: res.stats.includedFiles,
          meta: {
            entry: res.stats.entry,
            start: res.stats.start,
            end: res.stats.end,
            duration: res.stats.duration
          }
        };
        if (res.map) {
          data.sourcemap = JSON.parse(res.map.toString('utf8'));
          basePath = path.dirname(options.filename);
          data.sourcemap.sources = data.sourcemap.sources.map(function(relativePath) {
            return path.join(basePath, relativePath);
          });
        }
        return deferred.resolve(data);
      });
      return deferred.promise;
    };

    return SCSS;

  })(Adapter);

  module.exports = SCSS;

}).call(this);

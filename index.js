var mixin = require('smart-mixin');

var mixinProto = mixin({
  // lifecycle stuff is as you'd expect
  componentDidMount: mixin.MANY,
  componentWillMount: mixin.MANY,
  componentWillReceiveProps: mixin.MANY,
  shouldComponentUpdate: mixin.ONCE,
  componentWillUpdate: mixin.MANY,
  componentDidUpdate: mixin.MANY,
  componentWillUnmount: mixin.MANY,

  getInitialState: mixin.MANY_MERGED,
  getDefaultProps: mixin.MANY_MERGED,
  getChildContext: mixin.MANY_MERGED
});

function mixinClass(reactClass, reactMixin) {
  var prototypeMethods = {};
  var staticProps = {};

  Object.keys(reactMixin).forEach(function(key) {
    if(typeof reactMixin[key] === 'function') {
      prototypeMethods[key] = reactMixin[key];
    }
    else {
      staticProps[key] = reactMixin[key];
    }
  });

  mixinProto(reactClass.prototype, prototypeMethods);

  mixin({
    childContextTypes: mixin.MANY_MERGED_LOOSE,
    contextTypes: mixin.MANY_MERGED_LOOSE,
    propTypes: mixin.MANY_MERGED_LOOSE
  })(reactClass, staticProps);
}

module.exports = (function () {
  reactMixin = mixinProto;

  reactMixin.onClass = function(reactClass, reactMixin) {
    mixinClass(reactClass, reactMixin)
  };

  return reactMixin;
})();

var mixin = require('smart-mixin');
module.exports = function(reactClass, reactMixin) {
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

  mixin({
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
  })(reactClass.prototype, prototypeMethods);

  mixin({
    childContextTypes: mixin.MANY_MERGED,
    contextTypes: mixin.MANY_MERGED,
    propTypes: mixin.MANY_MERGED
  })(reactClass, staticProps);
};

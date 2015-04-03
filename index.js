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
  getChildContext: mixin.MANY_MERGED
});

function setDefaultProps(reactMixin) {
  var getDefaultProps = reactMixin.getDefaultProps;

  if(getDefaultProps) {
    reactMixin.defaultProps = getDefaultProps();

    delete reactMixin.getDefaultProps;
  }
}

function setInitialState(reactMixin) {
  var getInitialState = reactMixin.getInitialState;
  var componentWillMount = reactMixin.componentWillMount;

  if(getInitialState) {
    if(!componentWillMount) {
      reactMixin.componentWillMount = function() {
        this.setState(getInitialState.call(this));
      }
    }
    else {
      reactMixin.componentWillMount = function() {
        componentWillMount.call(this);
        this.setState(getInitialState.call(this));
      }
    }

    delete reactMixin.getInitialState;
  }
}

function mixinClass(reactClass, reactMixin) {
  setDefaultProps(reactMixin);
  setInitialState(reactMixin);

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
    propTypes: mixin.MANY_MERGED_LOOSE,
    defaultProps: mixin.MANY_MERGED_LOOSE
  })(reactClass, staticProps);
}

module.exports = (function () {
  reactMixin = mixinProto;

  reactMixin.onClass = function(reactClass, reactMixin) {
    mixinClass(reactClass, reactMixin)
  };

  return reactMixin;
})();

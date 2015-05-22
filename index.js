var mixin = require('smart-mixin');
var assign = require('object-assign');

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

  function applyInitialState(instance){
      var state = instance.state || {};
      assign(state, getInitialState.call(instance));
      instance.state = state;
  }

  if(getInitialState) {
    if(!componentWillMount) {
      reactMixin.componentWillMount = function() {
          applyInitialState(this);
      };
    }
    else {
      reactMixin.componentWillMount = function() {
        applyInitialState(this);
        componentWillMount.call(this);
      };
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
  var reactMixin = mixinProto;

  reactMixin.onClass = function(reactClass, mixin) {
    mixinClass(reactClass, mixin)
  };

  reactMixin.decorate = function(mixin) {
    return function(reactClass) {
      return reactMixin.onClass(reactClass, mixin);
    };
  }

  return reactMixin;
})();

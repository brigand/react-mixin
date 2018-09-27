var objectAssign = require('object-assign');

function toUnsafe(mixin) {
  var mixin2 = objectAssign({}, mixin);

  if (mixin2.componentWillMount) {
    mixin2.UNSAFE_componentWillMount = mixin2.componentWillMount;
    delete mixin2.componentWillMount;
  }

  if (mixin2.componentWillReceiveProps) {
    mixin2.UNSAFE_componentWillReceiveProps = mixin2.componentWillReceiveProps;
    delete mixin2.componentWillReceiveProps;
  }

  if (mixin2.componentWillUpdate) {
    mixin2.UNSAFE_componentWillUpdate = mixin2.componentWillUpdate;
    delete mixin2.componentWillUpdate;
  }

  return mixin2;
}

module.exports = toUnsafe;

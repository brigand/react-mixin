Want to use ES6/CoffeeScript/TypeScript/{InsertNoun}Script classes, and mixins?

React doesn't have anything built in for this, but don't worry!  This package implements
react's mixin strategy for arbitrary objects.

Here's an example:

```js
var reactMixin = require('react-mixin');
var someMixin = require('some-mixin');
class Foo extends React.Component {
    render: function(){ return <div /> }    
}
reactMixin(Foo.prototype, someMixin);
reactMixin(Foo.prototype, someOtherMixin);
```

That's pretty much it.  You get errors instead of silently overwriting things, like in react,
with the exception of things whitelisted in index.js as type MANY, MANY_MERGED (getDefaultProps, if you still need it),
and just an object merge with conflict error (propTypes).

Like this but want to use it outside of react?  See [smart-mixin][1] and define your own mixin spec.

[1]: https://github.com/brigand/smart-mixin


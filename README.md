![travis](https://travis-ci.org/brigand/react-mixin.svg)

Want to use ES6/CoffeeScript/TypeScript/{InsertNoun}Script classes, and mixins?

React doesn't have anything built in for this, but don't worry!  This package implements
react's mixin strategy for arbitrary objects.

Install with one of:

```sh
# recommended
npm install --save react-mixin@1

# will expose window.smartMixin or the smartMixin AMD module
curl 'wzrd.in/standalone/react-mixin@1' > vendor/smart-mixin.js
```


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

## Differences from createClass

React won't call getInitialState or getDefaultProps.  See [the blog post](http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html).

You can do it your self in the constructor.

```js
class Foo extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState(){
        return {foo: 'bar'};
    }
}
```

Also propTypes and defaultProps are now static properties.  You never actually pass the class to react-mixin, so you'll have to handle that on your own.

```js
Object.assign(MyClass.propTypes, MixinA.propTypes, MixinB.propTypes);

class Foo extends React.Component {
    constructor(props){
        super(Object.assign(
            {}, 
            mixinA.getDefaultProps && mixinA.getDefaultProps(),
            mixinB.getDefaultProps && mixinB.getDefaultProps(),
            props
        );
        this.state = this.getInitialState();
    }
}
```

That's pretty much it.  You get errors instead of silently overwriting things, like in react,
with the exception of things whitelisted in index.js as type MANY, MANY_MERGED (getDefaultProps/getInitialState).

Like this but want to use it outside of react?  See [smart-mixin][1] and define your own mixin spec.

## Should I use this?

I can't think of a more elegant solution to mixins in es6 classes.  If someone comes up with one, create an issue
and I'll link to it here.

Should you use es6 classes for react components?  Based on the hacks required above, I'd probably avoid it.
It's important that react makes it an option, and it's important to be able to use mixins with them, which
is why this library exists.

`createClass` isn't going anywhere.

[1]: https://github.com/brigand/smart-mixin


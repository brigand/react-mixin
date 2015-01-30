var mixin = require('smart-mixin');
module.exports = mixin({
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
    propTypes: function(left, right){
        if (process.env.NODE_ENV === "production") {
            return {};
        }

        // eliminate either or both being falsy
        if (!left && right) return right;
        if (!right && left) return left;
        if (!left && !right) return left;
        var toString = Object.prototype.toString;

        if (toString.call(left) !== '[object Object]' || toString.call(right) !== '[object Object]') {
            throw new TypeError("Cannot mixin propTypes of types " + toString.call(left) + " and " + toString.call(right));
        }

        // now try to merge them
        var result = {};
        Object.keys(left).forEach(function(key){
            if (right[key]){
                throw new TypeError("Cannot merge propTypes because of a key conflict: " + JSON.stringify(key));
            }
            result[key] = left[key];
        });

        Object.keys(right).forEach(function(key){
            result[key] = right[key];
        });

        return result;
    }

});

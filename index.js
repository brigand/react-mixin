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
});

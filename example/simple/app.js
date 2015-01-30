var React = require('react');
var reactMixin = require('../..');

class App extends React.Component {
    constructor(){
        super();
        this.state = {foo: 'bar'};
    }
    componentDidMount(){
        // use the mixin
        this.setTimeout(() => this.setState({foo: 'baz'}), 5000);
    }
    render(){
        return <div>{this.state.foo}</div>;
    }
}

// apply the mixin, just repeat this line to mixin more things
reactMixin(App.prototype, require('./set-timeout-mixin'));

// render it or export it
React.render(<App />, document.body);


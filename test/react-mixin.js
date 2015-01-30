var reactMixin = require('..');
var expect = require('expect.js');
var sinon = require('sinon');
var React = require('react');

describe('react-mixin', function(){
    var proto, instance;

    beforeEach(function(){
        function Component(){
        };
        Component.prototype = Object.create(React.Component);
        Component.prototype.constructor = Component;
        Component.prototype.render = function(){ return 1; };
        Component.prototype.handleClick = function(){ return 2; };
        proto = Component.prototype;
        instance = Object.create(Component.prototype);
    });

    it("doesn't always throw", function(){
        expect(function(){ reactMixin(proto, {}); }).to.not.throwException();
    });

    it("merges lifecycle methods", function(){
        var s1 = sinon.spy(), s2 = sinon.spy();
        proto.componentWillMount = s1;
        reactMixin(proto, {componentWillMount: s2});
        instance.componentWillMount();
        expect(s1.called).to.be.ok();
        expect(s2.called).to.be.ok();
    });

    it("throws when handleClick is defined in both", function(){
        expect(function(){
            reactMixin(proto, {handleClick: function(){}});
        }).to.throwException(/handleClick/);
    });
});

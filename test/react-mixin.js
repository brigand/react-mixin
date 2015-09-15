var reactMixin = require('..');
var expect = require('expect.js');
var sinon = require('sinon');
var React = require('react');
var objectAssign = require('object-assign');

describe('react-mixin', function() {
  describe('mixins prototype', function() {
    var proto;
    var instance;

    beforeEach(function() {
      function Component() {
        this.state = {
          foo: 'bar'
        }
      }
      ;
      Component.prototype = Object.create(React.Component);
      Component.prototype.constructor = Component;
      Component.prototype.render = function() {
        return 1;
      };
      Component.prototype.handleClick = function() {
        return 2;
      };
      proto = Component.prototype;
      instance = Object.create(Component.prototype);
    });

    it("doesn't always throw", function() {
      expect(function() {
        reactMixin(proto, {});
      }).to.not.throwException();
    });

    it("merges lifecycle methods", function() {
      var s1 = sinon.spy();
      var s2 = sinon.spy();
      proto.componentWillMount = s1;
      reactMixin(proto, {
        componentWillMount: s2
      });
      instance.componentWillMount();
      expect(s1.called).to.be.ok();
      expect(s2.called).to.be.ok();
    });

    it("throws when handleClick is defined in both", function() {
      expect(function() {
        reactMixin(proto, {
          handleClick: function() {}
        });
      }).to.throwException(/handleClick/);
    });
  });

  describe('mixins whole class', function() {
    var reactClass;

    beforeEach(function() {
      function Component() {
        this.state = {
          foo: 'bar'
        };
      }
      ;
      Component.prototype = Object.create(React.Component);
      Component.prototype.constructor = Component;
      Component.prototype.render = function() {
        return 1;
      };
      Component.prototype.handleClick = function() {
        return 2;
      };
      Component.prototype.setState = sinon.spy(function(nextState) {
        this.state = objectAssign(this.state || {}, nextState);
      });
      reactClass = Component;
    });

    it('mixins proto and static props separately', function() {
      var mixin = {
        contextTypes: {},
        getChildContext: function() {}
      };

      reactMixin.onClass(reactClass, mixin);

      expect(reactClass.contextTypes).to.exist;
      expect(reactClass.prototype.getChildContext).to.exist;

      expect(reactClass.getChildContext).not.to.exist;
      expect(reactClass.prototype.contextTypes).not.to.exist;
    });

    it('calls getDefaultProps and sets result as static prop', function() {
      var mixin = {
        getDefaultProps: function() {
          return {
            test: 'test'
          }
        }
      };

      reactMixin.onClass(reactClass, mixin);

      expect(reactClass.defaultProps).to.eql({
        test: 'test'
      });
      expect(reactClass.prototype.getDefaultProps).not.to.exist;
    });

    describe("decorator", function () {
      it('acts as decorator', function() {
        var mixin = {
          getDefaultProps: function() {
            return {
              test: 'test'
            }
          }
        };

        var decorator = reactMixin.decorate(mixin);
        var instance = decorator(reactClass);

        expect(instance.defaultProps).to.eql({
          test: 'test'
        });
        expect(instance.prototype.getDefaultProps).not.to.exist;
      });

      it('mixins proto and static props separately', function() {
        var mixin = {
          contextTypes: {},
          getChildContext: function() {}
        };

        var NewComponent = reactMixin.decorate(mixin)(reactClass);

        expect(NewComponent.contextTypes).to.exist;
        expect(NewComponent.prototype.getChildContext).to.exist;

        expect(NewComponent.getChildContext).not.to.exist;
        expect(NewComponent.prototype.contextTypes).not.to.exist;
      });

      it('should return a copy of the class', function () {
        var mixin = {
          contextTypes: {},
          getChildContext: function() {}
        };

        var NewComponent = reactMixin.decorate(mixin)(reactClass);
        expect(NewComponent).not.to.be(reactClass);
        expect(NewComponent.prototype).not.to.be(reactClass.prototype);
        expect(reactClass.contextTypes).not.to.be.ok();
        expect(reactClass.prototype.getChildContext).not.to.be.ok();
      });

      it("should correctly identify constructor", function () {
        var mixin = {
          contextTypes: {},
          getChildContext: function() {}
        };

        var NewComponent = reactMixin.decorate(mixin)(reactClass);
        var instance = new NewComponent();
        expect(instance.constructor).not.to.be(reactClass);
        expect(instance.constructor).to.be(NewComponent);
      });

      it('merges contextTypes even if class is proxied', function () {
        reactClass.contextTypes = {
          existingContext: React.PropTypes.any
        };

        var mixin = {
          contextTypes: {
            mixinContext: React.PropTypes.any
          }
        };

        // Emulate what react-proxy does to a class
        // https://github.com/gaearon/react-proxy/blob/master/src/createClassProxy.js
        var proxiedClass = function Proxied() {};
        proxiedClass.prototype.constructor = proxiedClass;
        proxiedClass.prototype.constructor.__proto__ = reactClass;

        var NewComponent = reactMixin.decorate(mixin)(proxiedClass);
        expect (NewComponent.contextTypes).to.have.keys('existingContext', 'mixinContext');
      });
    });

    it('handles contextTypes', function() {
      function doTest(a, b) {
        function Component() {
        }
        var mixinA = a !== null && {
            contextTypes: {
              foo: function() {
                return a
                }
              }
            };
          var mixinB = b !== null && {
              contextTypes: {
                foo: function() {
                  return b
                  }
                }
              };

            if (mixinA) {
              reactMixin.onClass(Component, mixinA);
              }
            if (mixinB) {
              reactMixin.onClass(Component, mixinB);
              }

            return Component.contextTypes.foo();
            }
          expect(doTest(true, true)).to.be.ok();
          expect(doTest(false, true)).to.not.be.ok();
          expect(doTest(true, false)).to.not.be.ok();
          expect(doTest(false, false)).to.not.be.ok();
        });

        it('merges statics', function() {
          function doTest(a, b) {
            function Component() {
              }
            var mixinA = a != null && {
                statics: a
              };
            var mixinB = b != null && {
                statics: b
              };

            if (mixinA) {
              reactMixin.onClass(Component, mixinA);
              }
            if (mixinB) {
              reactMixin.onClass(Component, mixinB);
              }

            return Component;
            }

          expect(doTest({
            foo: 'b'
          }).foo).to.be('b');
          expect(doTest({}, {
            foo: 'c'
          }).foo).to.be('c');
          expect(function() {
            doTest({
              foo: 'e'
            }, {
              foo: 'f'
            })
          }).to.throwException();
        });

        describe('wrap getInitialState into componentWillMount', function() {
          it('creates new componentWillMount if there is no such', function() {
            var mixin = {
              getInitialState: function() {
                return {
                  test: 'test'
                }
              }
            };

            reactMixin.onClass(reactClass, mixin);
            expect(reactClass.prototype.componentWillMount).to.exist;

            var instance = new reactClass();
            expect(instance.state).to.eql({
              foo: 'bar'
            });
            instance.componentWillMount();

            expect(reactClass.prototype.setState.calledOnce).to.be.false;
            expect(reactClass.prototype.getInitialState).not.to.exist;
            expect(instance.state).to.eql({
              foo: 'bar',
              test: 'test'
            });
          });

          it('merges two componentWillMount', function() {
            var mixin = {
              getInitialState: function() {
                return {
                  test: 'test'
                }
              },
              componentWillMount: function() {
                this.setState({
                  test1: 'test1'
                })
              }
            };

            reactMixin.onClass(reactClass, mixin);
            expect(reactClass.prototype.componentWillMount).to.exist;

            new reactClass().componentWillMount();

            expect(reactClass.prototype.setState.calledOnce).to.be.true
            expect(reactClass.prototype.getInitialState).not.to.exist;
          });

          it('calls getInitialState before original componentWillMount which have access to state', function() {
            var mixin = {
              getInitialState: function() {
                return {
                  counter: 22
                }
              },
              componentWillMount: function() {
                this.state.counter = this.state.counter + 1;
              }
            };

            reactMixin.onClass(reactClass, mixin);

            var obj = new reactClass();
            obj.componentWillMount();

            expect(obj.state.counter).to.be.eql(23);
          });

          it('should not mutate mixin definition', function () {
            var mixin = {
              getInitialState: function() {
                return {
                  counter: 22
                }
              },
              getDefaultProps: function () {
                return {
                  step: 1
                }
              }
            };

            reactMixin.onClass(reactClass, mixin);

            expect(mixin.getInitialState).to.be.a('function');
            expect(mixin.getDefaultProps).to.be.a('function');
          });
        });
      });

      describe('chaining mixins', function() {
        it('allows mixins with more mixins', function() {
          var deepestMixin = {
            getDefaultProps: function() {
              return {
                test4: 'deepest'
              };
            }
          };
          var deeperMixin = {
            mixins: [deepestMixin],
            getDefaultProps: function() {
              return {
                test3: 'deeper'
              };
            }
          };
          var deepMixin = {
            getDefaultProps: function() {
              return {
                test2: 'deep'
              };
            }
          };
          var shallowMixin = {
            mixins: [deepMixin, deeperMixin],
            getDefaultProps: function() {
              return {
                test: 'test'
              };
            }
          };
          var reactClass = function Component() {};

          reactMixin.onClass(reactClass, shallowMixin);

          expect(reactClass.defaultProps).to.eql({
            test: 'test',
            test2: 'deep',
            test3: 'deeper',
            test4: 'deepest'
          });
          expect(reactClass.prototype.getDefaultProps).not.to.exist;
        });

        // Test deep mixin invocation order.
        // From the React docs:
        // "Methods defined on mixins run in the order mixins were listed, followed by a method call on the component."
        //
        // Mixins on mixins should run before the mixin itself, but not before mixins listed before it.
        //
        // +---------+       +----------+        +---------+
        // |  spec   +-------> shallow  +------->+  deep1  |
        // +---------+       +----------+        +----+----+
        //                                            |
        //                                       +----+----+         +---------+
        //                                       |  deep2  +---------+ deepest |
        //                                       +---------+         +---------+
        //
        //
        // In this diagram, the correct invocation order is:
        //
        // deep1 -> deepest -> deep2 -> shallow -> spec
        //
        it('when chaining mixins, run in order listed', function() {
          var counter = 0;
          var deepestMixin = {
            componentWillMount: function() {
              this.deepest = counter++;
            }
          };
          var deepMixin2 = {
            mixins: [deepestMixin],
            componentWillMount: function() {
              this.deep2 = counter++;
            }
          };
          var deepMixin = {
            componentWillMount: function() {
              this.deep1 = counter++;
            }
          };
          var shallowMixin = {
            mixins: [deepMixin, deepMixin2],
            componentWillMount: function() {
              this.shallow = counter++;
            }
          };
          var reactClass = function Component() {};
          reactClass.prototype.componentWillMount = function() {
            this.spec = counter++;
          };

          reactMixin.onClass(reactClass, shallowMixin);
          var obj = new reactClass();
          obj.componentWillMount();
          console.dir(obj);

          expect(obj.deep1).to.equal(0);
          expect(obj.deepest).to.equal(1);
          expect(obj.deep2).to.equal(2);
          expect(obj.shallow).to.equal(3);
          expect(obj.spec).to.equal(4);
        });
      });
    });

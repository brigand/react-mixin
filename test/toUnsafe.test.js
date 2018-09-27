const toUnsafe = require('../toUnsafe');
var expect = require('expect.js');

it(`works`, () => {
  const a = () => {};
  const b = () => {};
  const c = () => {};

  const m1 = { componentWillMount: a, componentWillReceiveProps: b, componentWillUpdate: c};
  const m2 = toUnsafe(m1);

  console.log(m1)
  expect(m1).to.eql({ componentWillMount: a, componentWillReceiveProps: b, componentWillUpdate: c}, 'm1 not modified');
  expect(m2).to.eql({ UNSAFE_componentWillMount: a, UNSAFE_componentWillReceiveProps: b, UNSAFE_componentWillUpdate: c});
  expect(Object.keys(m2).sort()).to.eql(['UNSAFE_componentWillMount', 'UNSAFE_componentWillReceiveProps', 'UNSAFE_componentWillUpdate'])
})

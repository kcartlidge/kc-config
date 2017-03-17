module.exports = function () {
  process.env.NODE_ENV = 'TEST';

  return {
    files: [
      'lib/**/*.js'
    ],

    tests: [
      'test/**/*.spec.js'
    ],

    testFramework: 'mocha',

    env: {
      type: 'node',
      runner: 'node'
    }
  };
};

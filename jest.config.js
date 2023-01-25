module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(j|t)s?$': 'ts-jest',
    },
     transformIgnorePatterns: ['node_modules/*']
  };
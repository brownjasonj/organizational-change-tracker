module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
     transformIgnorePatterns: ['./node_modules/*']
  };
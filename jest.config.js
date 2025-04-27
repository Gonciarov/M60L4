

// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleDirectories: ['node_modules', '<rootDir>'],
  };
  
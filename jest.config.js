module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  //modulePathIgnorePatterns: ['<rootDir>/integration-test/'],
  collectCoverage: true,
  coverageDirectory: '../../coverage/test',
  coverageReporters: ['html', 'text'],
  coverageThreshold: {
      global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
      }
  },
};

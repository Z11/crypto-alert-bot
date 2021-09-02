module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
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
  reporters: [
    ['jest-html-reporters', {
        'publicPath': './coverage/',
        'filename': 'code-coverage.html',
      }
    ]
  ],
};

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.test.js' }],    
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react|react-dom|@material-tailwind/react)/)',
  ],
  testPathIgnorePatterns: ['babel.test.js'],
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
    '^react/jsx-runtime$': require.resolve('react/jsx-runtime'),
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

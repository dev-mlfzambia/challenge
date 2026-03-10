/**
 * Run e2e tests with NODE_ENV=development so node-config loads
 * config/development.yml (required for auth, db, etc.).
 */
process.env.NODE_ENV = 'development';

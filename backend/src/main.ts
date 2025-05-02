/**
 * This is a temporary solution to bypass NestJS bootstrapping
 * We're directly requiring the Express server implementation
 */

console.log('Starting Express server instead of NestJS...');

// Use require here since we're importing a JavaScript file
// This will immediately execute the Express server
require('./server');

// The bootstrap function is kept for compatibility but not actually used
async function bootstrap() {
  console.log('NestJS bootstrap function is disabled.');
  console.log('Using Express server instead. See server.js for implementation.');
}

// This is not called, but kept for reference
// bootstrap(); 
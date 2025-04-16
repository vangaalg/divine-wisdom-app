/**
 * Data initialization script for Divine Wisdom App
 * 
 * This script creates the data directory and initializes
 * empty JSON files for storing users, conversations, and messages.
 */

const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  console.log('Creating data directory...');
  fs.mkdirSync(DATA_DIR);
}

// File paths for storing data
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  console.log('Initializing users.json...');
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(CONVERSATIONS_FILE)) {
  console.log('Initializing conversations.json...');
  fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(MESSAGES_FILE)) {
  console.log('Initializing messages.json...');
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}

console.log('✅ Data initialization complete!');
console.log(`Data directory: ${DATA_DIR}`);
console.log(`Files created: users.json, conversations.json, messages.json`); 
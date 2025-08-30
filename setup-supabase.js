// This script helps you set up Supabase configuration
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for credentials
const promptForCredentials = async () => {
  return new Promise((resolve) => {
    console.log('\n===== Supabase Configuration Setup =====\n');
    console.log('This script will help you configure your Supabase credentials.');
    console.log('You can find these in your Supabase dashboard under Project Settings > API.\n');
    
    rl.question('Enter your Supabase Project URL (https://your-project-id.supabase.co): ', (url) => {
      rl.question('Enter your Supabase anon/public key: ', (key) => {
        resolve({
          url: url.trim(),
          key: key.trim()
        });
      });
    });
  });
};

// Function to validate credentials
const validateCredentials = (creds) => {
  const errors = [];
  
  if (!creds.url) {
    errors.push('- Supabase URL is required');
  } else if (!creds.url.startsWith('https://') || !creds.url.includes('supabase.co')) {
    errors.push('- Supabase URL should be in the format https://your-project-id.supabase.co');
  }
  
  if (!creds.key) {
    errors.push('- Supabase anon key is required');
  } else if (creds.key.length < 20) {
    errors.push('- Supabase anon key appears to be too short (should be a long string)');
  }
  
  return errors;
};

// Function to write to .env file
const writeEnvFile = (creds) => {
  const envContent = `# Supabase Configuration
# Updated on ${new Date().toLocaleString()}

# The URL to your Supabase project
VITE_SUPABASE_URL=${creds.url}

# The anon/public key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=${creds.key}
`;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    return true;
  } catch (err) {
    console.error('Error writing to .env file:', err);
    return false;
  }
};

// Main function
const main = async () => {
  try {
    const creds = await promptForCredentials();
    const errors = validateCredentials(creds);
    
    if (errors.length > 0) {
      console.log('\n❌ Invalid credentials:');
      errors.forEach(err => console.log(err));
      console.log('\nPlease run this script again with valid credentials.');
    } else {
      const success = writeEnvFile(creds);
      
      if (success) {
        console.log('\n✅ Supabase configuration has been updated successfully!');
        console.log('\nNext steps:');
        console.log('1. Restart your development server (npm run dev)');
        console.log('2. Check the Supabase Status panel to confirm connection');
      } else {
        console.log('\n❌ Failed to update Supabase configuration.');
        console.log('Please manually edit your .env file with the following values:');
        console.log(`VITE_SUPABASE_URL=${creds.url}`);
        console.log(`VITE_SUPABASE_ANON_KEY=${creds.key}`);
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    rl.close();
  }
};

main();

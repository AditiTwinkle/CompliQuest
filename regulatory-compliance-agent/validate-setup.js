// Simple validation script to check if the basic setup is working
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Regulatory Compliance Agent setup...\n');

// Check required files
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  '.env',
  'src/index.ts',
  'src/app.ts',
  'src/config/environment.ts',
  'src/config/bedrock.ts',
  'src/utils/logger.ts',
  'src/utils/errors.ts',
  'src/types/index.ts',
  'src/routes/health.ts',
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json structure
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  console.log('\n📦 Package.json validation:');
  console.log(`✅ Name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  
  const requiredDeps = ['express', 'cors', 'helmet', 'dotenv', 'winston'];
  const requiredDevDeps = ['typescript', 'ts-node', '@types/express', 'jest'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dependency: ${dep}`);
    } else {
      console.log(`❌ Missing dependency: ${dep}`);
      allFilesExist = false;
    }
  });
  
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ Dev dependency: ${dep}`);
    } else {
      console.log(`❌ Missing dev dependency: ${dep}`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  allFilesExist = false;
}

// Check .env file
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const requiredEnvVars = ['PORT', 'NODE_ENV', 'AWS_REGION', 'BEDROCK_MODEL_ID'];
  
  console.log('\n🔧 Environment variables:');
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ Missing: ${envVar}`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading .env file: ${error.message}`);
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Setup validation PASSED! All required files and configurations are present.');
  console.log('\nNext steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Start development: npm run dev');
  console.log('3. Run tests: npm test');
} else {
  console.log('❌ Setup validation FAILED! Please check the missing files and configurations above.');
}
console.log('='.repeat(50));
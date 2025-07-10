#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const ARCHETYPE_VERSION = '25.02-SNAPSHOT';
const GROUP_ID = 'org.example';
const VERSION = '1.0-SNAPSHOT';

// Define all archetypes and their flavors
const archetypes = [
  {
    artifactId: 'webforj-archetype-hello-world',
    name: 'Hello World',
    flavors: ['webforj', 'webforj-spring']
  },
  {
    artifactId: 'webforj-archetype-blank',
    name: 'Blank',
    flavors: ['webforj', 'webforj-spring']
  },
  {
    artifactId: 'webforj-archetype-tabs',
    name: 'Tabs',
    flavors: ['webforj', 'webforj-spring']
  },
  {
    artifactId: 'webforj-archetype-sidemenu',
    name: 'Sidemenu',
    flavors: ['webforj', 'webforj-spring']
  }
];

// Create output directory
const outputDir = '.generated';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Change to output directory
process.chdir(outputDir);

console.log('🚀 Starting archetype generation tests...\n');

let successCount = 0;
let failureCount = 0;

// Generate projects
archetypes.forEach(archetype => {
  archetype.flavors.forEach(flavor => {
    const projectName = `${archetype.artifactId.replace('webforj-archetype-', '')}-${flavor.replace('webforj-', '')}`;
    const appName = `${archetype.name} ${flavor === 'webforj-spring' ? 'Spring' : ''}`.trim();

    console.log(`\n📦 Generating: ${projectName}`);
    console.log(`   Archetype: ${archetype.artifactId}`);
    console.log(`   Flavor: ${flavor}`);

    const command = `mvn -B archetype:generate \
      -DarchetypeGroupId=com.webforj \
      -DarchetypeArtifactId=${archetype.artifactId} \
      -DarchetypeVersion=${ARCHETYPE_VERSION} \
      -DgroupId=${GROUP_ID} \
      -DartifactId=${projectName} \
      -Dversion=${VERSION} \
      -DappName="${appName}" \
      -Dflavor=${flavor}`.replace(/\s+/g, ' ');

    try {
      // Remove existing project directory if it exists
      if (fs.existsSync(projectName)) {
        fs.rmSync(projectName, { recursive: true, force: true });
      }

      // Execute Maven command
      execSync(command, { stdio: 'inherit' });

      // Verify project was created
      if (fs.existsSync(projectName)) {
        console.log(`✅ Successfully generated: ${projectName}`);
        successCount++;

        // Optionally run a quick test
        console.log(`   Running quick build test...`);
        try {
          execSync('mvn clean compile', {
            cwd: projectName,
            stdio: 'pipe'
          });
          console.log(`   ✅ Build successful`);
        } catch (buildError) {
          console.log(`   ⚠️  Build failed`);
        }
      } else {
        throw new Error('Project directory not created');
      }
    } catch (error) {
      console.error(`❌ Failed to generate: ${projectName}`);
      console.error(`   Error: ${error.message}`);
      failureCount++;
    }
  });
});

// Summary report
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY REPORT');
console.log('='.repeat(60));
console.log(`Total projects: ${successCount + failureCount}`);
console.log(`✅ Successful: ${successCount}`);
console.log(`❌ Failed: ${failureCount}`);

// Exit with appropriate code
process.exit(failureCount > 0 ? 1 : 0);

const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const templateRepoName = 'badged-alm/template-nodejs-v1-B';
let success = false;

try {
  rl.question('Please, insert GitHub repository URL:', (githubURL) => {
    if (!githubURL.includes('github.com/')) {
      console.log('Invalid URL.');
      rl.close();
    } else {
      const githubRepo = githubURL.split('github.com/')[1].split('/')[0] + '/' + githubURL.split('github.com/')[1].split('/')[1];

      // Package.json
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      packageJson.name = githubRepo.split('/')[1];
      packageJson.repository.url = 'git+https://github.com/' + githubRepo + '.git';
      packageJson.bugs.url = 'https://github.com/' + githubRepo + '/issues';
      packageJson.homepage = 'https://github.com/' + githubRepo + '#readme';

      // README.md
      let readme = fs.readFileSync('README.md', 'utf8');
      readme = readme.split(templateRepoName).join(githubRepo);

      // Write files and close
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2), 'utf8');
      fs.writeFileSync('README.md', readme, 'utf8');
      success = true;
      rl.close();
    }
  });
} catch (err) {
  console.log(err);
  rl.close();
}

rl.on('close', () => {
  if (success) {
    console.log('Setup success!');
  } else {
    console.log('Setup failed!');
  }
  process.exit(0);
});

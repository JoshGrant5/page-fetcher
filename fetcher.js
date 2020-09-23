// Should take a URL as a command-line argument as well as a local file path and download the resource to the specified path

const request = require('request');
const fs = require('fs'); // node filesystem
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const data = process.argv.splice(2);

request(data[0], (error, response, body) => {
  if (error || response.statusCode !== 200) {
    console.log('Terminating application due to error.\nError: ', error, '\nstatusCode: ', response && response.statusCode);
    process.exit(); // exit out of program without writing to the file
  } else {
    // Check if the file exists in the current directory.
      fs.access(data[1], err => {
      if (!err) { // means file already exists in directory
        rl.question('File already exists - Would you like to overwride specified file?: (Y/N) ', answer => {
          if (answer !== 'Y') {
            console.log('Exiting program');
            process.exit();
          } 
        });
      }
    });
    fs.writeFile(data[1], body, () => { // Need to write the body to the specified path (will create new file or overwride current file of the same name) 
      let bytes = fs.statSync(data[1]); // returns an object called stats, with key of size
      console.log(`Downloaded and saved ${bytes.size} bytes to ${data[1]}`);
      process.exit();
    });
  }
});
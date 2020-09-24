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
  // check if resource results in an error message or unsatisfactory status code
  if (error || response.statusCode !== 200) {
    console.log('Terminating application due to error.\nError: ', error, '\nstatusCode: ', response && response.statusCode);
    process.exit(); // exit out of program without writing to the file
  } else {
    // Check if the file exists in the current directory.
      fs.access(data[1], fs.constants.F_OK, err => {
        if (!err) { // means file already exists in directory
          rl.question('File already exists - Would you like to overwride specified file?: (Y/N) ', answer => {
            if (answer !== 'Y') {
              console.log('Exiting program');
              process.exit();
            } else {
              fs.writeFile(data[1], body, () => { // Write the body to the specified path (will create new file or overwride current file of the same name if) 
                let bytes = fs.statSync(data[1]); // returns an object called stats, with key of size
                console.log(`Downloaded and saved ${bytes.size} bytes to ${data[1]}`);
                process.exit();
              });
            }
          });
        }
      });
      // Can come back to this...
      // Check if the file is readable.
      // fs.access(data[1], fs.constants.R_OK, err => {
      //   if (err) {
      //     console.log('Local file path is not readable - exiting program');
      //     process.exit();
      //   }
      // });
      fs.writeFile(data[1], body, () => { // Write the body to the specified path (will create new file or overwride current file of the same name if) 
        let bytes = fs.statSync(data[1]); // returns an object called stats, with key of size
        console.log(`Downloaded and saved ${bytes.size} bytes to ${data[1]}`);
        process.exit();
      });
    }
});
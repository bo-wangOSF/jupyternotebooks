const fs = require('fs');
const path = require('path');
const mailparser = require('mailparser');

function parseEmlFile(file_path) {
  const emlData = fs.readFileSync(file_path, 'utf-8');

  return new Promise((resolve, reject) => {
    mailparser.simpleParser(emlData, (err, parsedData) => {
      if (err) {
        reject(err);
      } else {
        resolve(parsedData);
      }
    });
  });
}

function traverseFolder(folder_path) {
  fs.readdirSync(folder_path).forEach(file => {
    const file_path = path.join(folder_path, file);
    const file_stats = fs.statSync(file_path);

    if (file_stats.isFile() && path.extname(file_path).toLowerCase() === '.eml') {
      parseEmlFile(file_path)
        .then(parsedData => {
          
          console.log(
parsedData.subject+"|",
"`"+parsedData.text+"`"+"|",
file_path
          );
        })
        .catch(err => {
          console.error(err);
        });
    } else if (file_stats.isDirectory()) {
      traverseFolder(file_path);
    }
  

  });
}

const rows = [];

// Example usage
const folder_path = '/Users/bowang/Downloads/emailfiles';
traverseFolder(folder_path);
  
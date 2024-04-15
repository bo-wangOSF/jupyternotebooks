const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const crypto = require('crypto');

const domain = 'http://example.com';
const account_id = '3434434';
const client = '';
const secret = '';

function calculateMD5(input) {
  const hash = crypto.createHash('md5');
  hash.update(input);
  return hash.digest('hex');
}

function auth(client, secret, account_id){
    const apiUrl = domain + '/v2/token';
    const headers = {
        'Content-Type': 'application/json',
        // Add any other required headers
      };
    const payload = {
        "grant_type": "client_credentials",
        "client_id": client,
        "client_secret": secret,
        "scope": "email_read email_write email_send",
        "account_id": account_id
        }
    return axios.post(apiUrl, payload, { headers });
}

function invokeApi(subject, body,file, token) {
    const regex = /emailfiles\/(.*?)\/(.*)/
    const match = path.match(regex);
    
  // Replace the URL with your actual API endpoint
  const apiUrl = 'https://example.com/asset/v1/content/assets';

  // Replace the headers and payload with your actual data structure
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token 
    // Add any other required headers
  };

  const payload = 
  {
    "name": match[1]+' '+calculateMD5(match[2]),
    "channels": {
      "email": true,
      "web": false
    },
    "views": {
      "html": {
        "content": JSON.stringify(body)
      },
      "text": {},
      "subjectline": subject,
      "preheader": {}
    },
    "assetType": {
      "name": "templatebasedemail",
      "id": 207
    }
  }

  return axios.post(apiUrl, payload, { headers });
}

function processCsvFile(file_path) {
  fs.createReadStream(file_path)
    .pipe(csv())
    .on('data', (row) => {
      const { subject, body, file } = row;
      auth(client, secret, account_id).then(response => {
        token = response['access_token'];
        invokeApi(subject, body, file, token)
        .then(response => {
          console.log(`API response for subject "${subject}":`, response.data);
        })
        .catch(error => {
          `console for subject "${subject}":`, error
        });
      })
      
    })
    .on('end', () => {
      console.log('CSV file processing completed.');
    });
}

// Example usage
const file_path = './output.csv';
processCsvFile(file_path);

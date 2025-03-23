const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

// Function to format the JSON output for console display
function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

async function runManualTests() {
  try {
    console.log('\n===== Running Manual Tests =====\n');
    
    // Test 1: Get API Documentation
    console.log('Test 1: Get API Documentation');
    const docsResponse = await axios.get(`http://localhost:${PORT}`);
    console.log('API Documentation:');
    console.log(prettyJson(docsResponse.data));
    console.log('\n-----------------------------------\n');
    
    // Test 2: Get Template
    console.log('Test 2: Get Template');
    const templateResponse = await axios.get(`${BASE_URL}/template`);
    console.log('Template:');
    console.log(prettyJson(templateResponse.data));
    console.log('\n-----------------------------------\n');
    
    // Test 3: Get Template Metadata
    console.log('Test 3: Get Template Metadata');
    const metadataResponse = await axios.get(`${BASE_URL}/metadata`);
    console.log('Template Metadata:');
    console.log(prettyJson(metadataResponse.data));
    console.log('\n-----------------------------------\n');
    
    // Test 4: List Parameters
    console.log('Test 4: List Parameters');
    const parametersResponse = await axios.get(`${BASE_URL}/parameters`);
    console.log('Parameters:');
    console.log(prettyJson(parametersResponse.data));
    console.log('\n-----------------------------------\n');
    
    // Test 5: Get Version History
    console.log('Test 5: Get Version History');
    const versionsResponse = await axios.get(`${BASE_URL}/versions`);
    console.log('Version History:');
    console.log(prettyJson(versionsResponse.data));
    console.log('\n-----------------------------------\n');
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Execute the tests
runManualTests();
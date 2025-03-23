const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

// Function to format the JSON output for console display
function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

async function testParameterGroupsWithParams() {
  try {
    console.log('\n===== Testing Parameter Groups with Parameters Endpoint =====\n');
    
    // Get all parameter groups with their parameters
    console.log('Fetching all parameter groups with their parameters...');
    const response = await axios.get(`${BASE_URL}/parameter-groups-with-params`);
    
    console.log('\nResponse Data:\n');
    console.log(prettyJson(response.data));
    
    // Check if the ungrouped parameters are properly handled
    if (response.data.Ungrouped) {
      console.log('\nUngrouped parameters found:');
      console.log(prettyJson(response.data.Ungrouped));
    } else {
      console.log('\nNo ungrouped parameters found.');
    }

    // Count total parameters and groups
    let totalParams = 0;
    let groupCount = 0;
    
    for (const groupName in response.data) {
      groupCount++;
      const paramsInGroup = Object.keys(response.data[groupName].parameters || {}).length;
      totalParams += paramsInGroup;
      console.log(`Group: ${groupName} - ${paramsInGroup} parameters`);
    }
    
    console.log(`\nSummary: ${groupCount} groups with a total of ${totalParams} parameters.`);
    
    console.log('\nTest completed successfully!\n');
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Execute the test
testParameterGroupsWithParams();
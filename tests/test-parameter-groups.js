const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

// Function to format the JSON output for console display
function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

async function testParameterGroups() {
  try {
    console.log('\n===== Testing Parameter Groups Endpoints =====\n');
    
    // Get all parameter groups
    console.log('Fetching all parameter groups...');
    const groupsResponse = await axios.get(`${BASE_URL}/parameter-groups`);
    
    console.log('\nAll Parameter Groups:\n');
    console.log(prettyJson(groupsResponse.data));
    
    // Choose a group name for testing the specific group endpoint
    const groupNames = Object.keys(groupsResponse.data);
    if (groupNames.length > 0) {
      const testGroupName = groupNames[0];
      
      console.log(`\nFetching details for parameter group: ${testGroupName}`);
      const singleGroupResponse = await axios.get(`${BASE_URL}/parameter-groups/${testGroupName}`);
      
      console.log('\nParameter Group Details:\n');
      console.log(prettyJson(singleGroupResponse.data));
    } else {
      console.log('\nNo parameter groups found to test specific group endpoint.');
    }
    
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
testParameterGroups();
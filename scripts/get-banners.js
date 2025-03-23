/**
 * This script demonstrates how to fetch banner configurations from Firebase Remote Config
 * using the parameter groups API.
 * 
 * It specifically looks for a 'Banners' parameter group and formats the output
 * in a way that would be useful for a frontend banner management system.
 */

const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

// Function to format the JSON output for console display
function prettyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

// Process banner parameters to a more frontend-friendly format
function processBannerParameters(bannersGroup) {
  if (!bannersGroup || !bannersGroup.parameters) {
    return [];
  }
  
  const banners = [];
  
  // Convert each parameter into a banner object
  for (const [key, param] of Object.entries(bannersGroup.parameters)) {
    try {
      // For JSON type parameters, parse the value
      if (param.valueType === 'JSON' && param.defaultValue && param.defaultValue.value) {
        const bannerValue = typeof param.defaultValue.value === 'object' 
          ? param.defaultValue.value 
          : JSON.parse(param.defaultValue.value);
        
        banners.push({
          id: key,
          ...bannerValue,
          // Add conditional values if they exist
          conditionalVariants: param.conditionalValues ? Object.keys(param.conditionalValues).map(conditionName => {
            const condValue = param.conditionalValues[conditionName];
            return {
              conditionName,
              value: typeof condValue.value === 'object' ? condValue.value : JSON.parse(condValue.value)
            };
          }) : []
        });
      } else {
        // For non-JSON parameters, include them with basic structure
        banners.push({
          id: key,
          value: param.defaultValue ? param.defaultValue.value : null,
          type: param.valueType
        });
      }
    } catch (error) {
      console.error(`Error processing banner parameter ${key}:`, error.message);
    }
  }
  
  return banners;
}

async function getBanners() {
  try {
    console.log('\n===== Fetching Banner Configurations =====\n');
    
    // Get all parameter groups with their parameters
    const response = await axios.get(`${BASE_URL}/parameter-groups-with-params`);
    const groups = response.data;
    
    // Look for a 'Banners' group specifically
    const bannersGroup = groups['Banners'] || {};
    
    if (Object.keys(bannersGroup).length === 0) {
      console.log('No Banners parameter group found. Available groups are:');
      console.log(Object.keys(groups).join(', '));
      return;
    }
    
    console.log(`Found Banners parameter group with ${Object.keys(bannersGroup.parameters || {}).length} parameters.`);
    
    // Process banner parameters into a more structured format
    const banners = processBannerParameters(bannersGroup);
    
    console.log('\nProcessed Banner Configurations:');
    console.log(prettyJson(banners));
    
    console.log(`\nTotal banners: ${banners.length}\n`);
    
    // Count banners with conditional variants
    const bannersWithConditions = banners.filter(b => b.conditionalVariants && b.conditionalVariants.length > 0);
    if (bannersWithConditions.length > 0) {
      console.log(`${bannersWithConditions.length} banners have conditional variants.`);
    }
    
    console.log('\n===== Banner Fetch Complete =====\n');
    
    return banners;
  } catch (error) {
    console.error('Error fetching banners:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Execute the script
getBanners();
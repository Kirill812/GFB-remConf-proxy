const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

// ASCII characters for drawing the tree
const TREE = {
  BRANCH: '├── ',
  CORNER: '└── ',
  VERTICAL: '│   ',
  SPACE: '    '
};

// ANSI color codes for terminal output
const COLOR = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  BRIGHT: '\x1b[1m'
};

// Get value type color
function getValueTypeColor(valueType) {
  const colorMap = {
    'STRING': COLOR.GREEN,
    'NUMBER': COLOR.YELLOW,
    'BOOLEAN': COLOR.MAGENTA,
    'JSON': COLOR.CYAN
  };
  return colorMap[valueType] || COLOR.RESET;
}

// Format parameter value based on type for display
function formatValue(parameter) {
  if (!parameter || !parameter.defaultValue) return 'undefined';
  
  const valueType = parameter.valueType;
  const value = parameter.defaultValue.value;
  
  switch (valueType) {
    case 'JSON':
      try {
        const parsed = typeof value === 'object' ? value : JSON.parse(value);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return String(value);
      }
    case 'BOOLEAN':
      return value ? 'true' : 'false';
    default:
      return String(value);
  }
}

// Print the tree representation of parameter groups and their parameters
async function printParameterGroupsTree() {
  try {
    console.log('\n=== Firebase Remote Config Parameter Groups ===\n');
    
    // Fetch all parameter groups with their parameters
    const response = await axios.get(`${BASE_URL}/parameter-groups-with-params`);
    const data = response.data;
    
    const groupNames = Object.keys(data);
    const totalGroups = groupNames.length;
    
    // Calculate total parameters
    let totalParams = 0;
    groupNames.forEach(groupName => {
      totalParams += Object.keys(data[groupName].parameters || {}).length;
    });
    
    console.log(`${COLOR.BRIGHT}Total: ${totalGroups} groups, ${totalParams} parameters${COLOR.RESET}\n`);
    
    // Print each group and its parameters as a tree
    groupNames.forEach((groupName, groupIndex) => {
      const group = data[groupName];
      const isLastGroup = groupIndex === groupNames.length - 1;
      const paramNames = Object.keys(group.parameters || {});
      
      // Print group name
      console.log(`${isLastGroup ? TREE.CORNER : TREE.BRANCH}${COLOR.BRIGHT}${COLOR.BLUE}${groupName}${COLOR.RESET} ${group.description ? `(${group.description})` : ''}`);
      
      // Print parameters
      paramNames.forEach((paramName, paramIndex) => {
        const parameter = group.parameters[paramName];
        const isLastParam = paramIndex === paramNames.length - 1;
        
        // Determine prefix for this parameter
        const prefix = isLastGroup ? TREE.SPACE : TREE.VERTICAL;
        
        // Value type with color
        const valueType = parameter.valueType;
        const valueTypeColored = `${getValueTypeColor(valueType)}${valueType}${COLOR.RESET}`;
        
        // Print parameter name and type
        console.log(`${prefix}${isLastParam ? TREE.CORNER : TREE.BRANCH}${COLOR.YELLOW}${paramName}${COLOR.RESET} (${valueTypeColored})`);
        
        // Print parameter value
        const value = formatValue(parameter);
        const displayValue = value.length > 80 ? `${value.substring(0, 77)}...` : value;
        
        const valuePrefix = `${prefix}${isLastParam ? TREE.SPACE : TREE.VERTICAL}`;
        console.log(`${valuePrefix}${TREE.CORNER}Value: ${getValueTypeColor(valueType)}${displayValue}${COLOR.RESET}`);
        
        // Print if parameter has conditional values
        if (parameter.conditionalValues && Object.keys(parameter.conditionalValues).length > 0) {
          console.log(`${valuePrefix}${TREE.SPACE}${COLOR.MAGENTA}(Has conditional values)${COLOR.RESET}`);
        }
      });
      
      // Add space between groups
      if (!isLastGroup) console.log('');
    });
    
    console.log('\n=== End of Parameter Groups ===\n');
    
  } catch (error) {
    console.error('\nError fetching parameter groups:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Execute the demo
printParameterGroupsTree();
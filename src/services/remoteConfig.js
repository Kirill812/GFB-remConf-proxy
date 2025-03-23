const admin = require('../config/firebase');

const remoteConfig = {
  // Get the current template
  getTemplate: async () => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      return template;
    } catch (error) {
      console.error('Error getting template:', error);
      throw error;
    }
  },

  // List all parameter groups
  listParameterGroups: async () => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      return template.parameterGroups || {};
    } catch (error) {
      console.error('Error listing parameter groups:', error);
      throw error;
    }
  },

  // Get a specific parameter group
  getParameterGroup: async (groupName) => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      const group = template.parameterGroups ? template.parameterGroups[groupName] : null;
      
      if (!group) {
        throw new Error(`Parameter group ${groupName} not found`);
      }
      
      // Add the name to the group object for reference
      return {
        name: groupName,
        ...group
      };
    } catch (error) {
      console.error(`Error getting parameter group ${groupName}:`, error);
      throw error;
    }
  },

  // Get a specific parameter
  getParameter: async (parameterName) => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      return template.parameters[parameterName];
    } catch (error) {
      console.error(`Error getting parameter ${parameterName}:`, error);
      throw error;
    }
  },

  // Update the template
  updateTemplate: async (templateObject) => {
    try {
      const updatedTemplate = await admin.remoteConfig().publishTemplate(templateObject);
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // List all parameters
  listParameters: async () => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      return template.parameters;
    } catch (error) {
      console.error('Error listing parameters:', error);
      throw error;
    }
  },

  // Get template metadata
  getTemplateMetadata: async () => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      return {
        version: template.version,
        etag: template.etag,
        updateTime: template.updateTime
      };
    } catch (error) {
      console.error('Error getting template metadata:', error);
      throw error;
    }
  },

  // Create or update a parameter
  updateParameter: async (paramName, paramData) => {
    try {
      const template = await admin.remoteConfig().getTemplate();
      template.parameters[paramName] = paramData;

      const updatedTemplate = await admin.remoteConfig().publishTemplate(template);
      return updatedTemplate.parameters[paramName];
    } catch (error) {
      console.error(`Error updating parameter ${paramName}:`, error);
      throw error;
    }
  },

  // Delete a parameter
  deleteParameter: async (paramName) => {
    try {
      const template = await admin.remoteConfig().getTemplate();

      if (!template.parameters[paramName]) {
        throw new Error(`Parameter ${paramName} not found`);
      }

      delete template.parameters[paramName];
      await admin.remoteConfig().publishTemplate(template);

      return { success: true, message: `Parameter ${paramName} deleted` };
    } catch (error) {
      console.error(`Error deleting parameter ${paramName}:`, error);
      throw error;
    }
  },

  // Get version history
  getVersionHistory: async (versionNumber) => {
    try {
      if (versionNumber) {
        const version = await admin.remoteConfig().getTemplateAtVersion(versionNumber);
        return version;
      }

      // If no specific version is requested return latest 5 versions
      const versionList = await admin.remoteConfig().listVersions({ pageSize: 5 });
      return versionList;
    } catch (error) {
      console.error('Error getting version history:', error);
      throw error;
    }
  },

  // Rollback to a specific version
  rollbackToVersion: async (versionNumber) => {
    try {
      const result = await admin.remoteConfig().rollback(versionNumber);
      return result;
    } catch (error) {
      console.error(`Error rolling back to version ${versionNumber}:`, error);
      throw error;
    }
  },

  // Get all parameter groups with their parameters
  getAllParameterGroupsWithParams: async () => {
    try {
      // Just return the exact structure from the getParameterGroup endpoint
      // but include ALL parameter groups in a single call
      const template = await admin.remoteConfig().getTemplate();
      const parameterGroups = template.parameterGroups || {};
      const allParameters = template.parameters || {};
      
      // Create a copy of parameter groups with all parameters included
      const result = {};
      
      // Add all groups with their respective parameters
      for (const groupName in parameterGroups) {
        // Copy the original group data and add the name
        result[groupName] = {
          ...parameterGroups[groupName]
        };
        
        // Copy all parameters that belong to this group from the main parameters object
        if (!result[groupName].parameters) {
          result[groupName].parameters = {};
        }
      }
      
      // Create "Ungrouped" category for parameters not in any group
      result['Ungrouped'] = {
        description: 'Parameters not assigned to any group',
        parameters: {}
      };
      
      // Check all parameters and assign them to appropriate groups
      for (const paramName in allParameters) {
        const param = allParameters[paramName];
        let assigned = false;
        
        // Find if this parameter exists in any group and add it there
        for (const groupName in parameterGroups) {
          // Use the original source of truth from the template
          if (parameterGroups[groupName].parameters && parameterGroups[groupName].parameters[paramName]) {
            result[groupName].parameters[paramName] = param;
            assigned = true;
            break;
          }
        }
        
        // If not found in any group, add to Ungrouped
        if (!assigned) {
          result['Ungrouped'].parameters[paramName] = param;
        }
      }
      
      // Remove the "Ungrouped" category if it's empty
      if (Object.keys(result['Ungrouped'].parameters).length === 0) {
        delete result['Ungrouped'];
      }
      
      return result;
    } catch (error) {
      console.error('Error getting all parameter groups with params:', error);
      throw error;
    }
  }
};

module.exports = remoteConfig;
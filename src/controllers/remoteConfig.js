const remoteConfigService = require('../services/remoteConfig');

const remoteConfigController = {
  getTemplate: async (req, res) => {
    try {
      const template = await remoteConfigService.getTemplate();
      console.log('Retrieved template:', JSON.stringify(template, null, 2));
      res.json(template);
    } catch (error) {
      console.error('Controller error getting template:', error);
      res.status(500).json({ error: error.message });
    }
  },

  listParameterGroups: async (req, res) => {
    try {
      const groups = await remoteConfigService.listParameterGroups();
      console.log('Listed parameter groups:', JSON.stringify(groups, null, 2));
      res.json(groups);
    } catch (error) {
      console.error('Controller error listing parameter groups:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getParameterGroup: async (req, res) => {
    try {
      const { name } = req.params;
      const group = await remoteConfigService.getParameterGroup(name);

      if (!group) {
        return res.status(404).json({ error: `Parameter group ${name} not found` });
      }

      console.log(`Retrieved parameter group ${name}:`, JSON.stringify(group, null, 2));
      res.json(group);
    } catch (error) {
      console.error(`Controller error getting parameter group ${req.params.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  },

  getParameter: async (req, res) => {
    try {
      const { name } = req.params;
      const parameter = await remoteConfigService.getParameter(name);

      if (!parameter) {
        return res.status(404).json({ error: `Parameter ${name} not found` });
      }

      console.log(`Retrieved parameter ${name}:`, JSON.stringify(parameter, null, 2));
      res.json(parameter);
    } catch (error) {
      console.error(`Controller error getting parameter ${req.params.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  },

  updateTemplate: async (req, res) => {
    try {
      const templateUpdate = req.body;
      const updatedTemplate = await remoteConfigService.updateTemplate(templateUpdate);
      console.log('Updated template:', JSON.stringify(updatedTemplate, null, 2));
      res.json(updatedTemplate);
    } catch (error) {
      console.error('Controller error updating template:', error);
      res.status(500).json({ error: error.message });
    }
  },

  listParameters: async (req, res) => {
    try {
      const parameters = await remoteConfigService.listParameters();
      console.log('Listed parameters:', JSON.stringify(parameters, null, 2));
      res.json(parameters);
    } catch (error) {
      console.error('Controller error listing parameters:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getTemplateMetadata: async (req, res) => {
    try {
      const metadata = await remoteConfigService.getTemplateMetadata();
      console.log('Retrieved template metadata:', JSON.stringify(metadata, null, 2));
      res.json(metadata);
    } catch (error) {
      console.error('Controller error getting template metadata:', error);
      res.status(500).json({ error: error.message });
    }
  },

  updateParameter: async (req, res) => {
    try {
      const { name } = req.params;
      const paramData = req.body;

      const updatedParam = await remoteConfigService.updateParameter(name, paramData);
      console.log(`Updated parameter ${name}:`, JSON.stringify(updatedParam, null, 2));

      res.json(updatedParam);
    } catch (error) {
      console.error(`Controller error updating parameter ${req.params.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  },

  deleteParameter: async (req, res) => {
    try {
      const { name } = req.params;
      const result = await remoteConfigService.deleteParameter(name);

      console.log(`Deleted parameter ${name}:`, JSON.stringify(result, null, 2));
      res.json(result);
    } catch (error) {
      console.error(`Controller error deleting parameter ${req.params.name}:`, error);
      res.status(500).json({ error: error.message });
    }
  },

  getVersionHistory: async (req, res) => {
    try {
      const { version } = req.params;
      const versionNumber = version ? parseInt(version, 10) : null;

      const versionHistory = await remoteConfigService.getVersionHistory(versionNumber);
      console.log('Retrieved version history:', JSON.stringify(versionHistory, null, 2));

      res.json(versionHistory);
    } catch (error) {
      console.error('Controller error getting version history:', error);
      res.status(500).json({ error: error.message });
    }
  },

  rollbackToVersion: async (req, res) => {
    try {
      const { version } = req.params;

      if (!version) {
        return res.status(400).json({ error: 'Version number is required' });
      }

      const versionNumber = parseInt(version, 10);
      const result = await remoteConfigService.rollbackToVersion(versionNumber);

      console.log(`Rolled back to version ${version}:`, JSON.stringify(result, null, 2));
      res.json(result);
    } catch (error) {
      console.error(`Controller error rolling back to version ${req.params.version}:`, error);
      res.status(500).json({ error: error.message });
    }
  },
  
  // Get all parameter groups with their parameters
  getAllParameterGroupsWithParams: async (req, res) => {
    try {
      const groupsWithParams = await remoteConfigService.getAllParameterGroupsWithParams();
      console.log('Retrieved all parameter groups with params');
      res.json(groupsWithParams);
    } catch (error) {
      console.error('Controller error getting all parameter groups with params:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = remoteConfigController;
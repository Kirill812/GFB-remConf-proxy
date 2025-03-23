const express = require('express');
const remoteConfigController = require('../controllers/remoteConfig');

const router = express.Router();

// Template routes
router.get('/template', remoteConfigController.getTemplate);
router.put('/template', remoteConfigController.updateTemplate);

// Parameter groups routes
router.get('/parameter-groups', remoteConfigController.listParameterGroups);
router.get('/parameter-groups/:name', remoteConfigController.getParameterGroup);

// New endpoint for getting all parameter groups with their parameters
router.get('/parameter-groups-with-params', remoteConfigController.getAllParameterGroupsWithParams);

// Parameters routes
router.get('/parameters', remoteConfigController.listParameters);
router.get('/parameters/:name', remoteConfigController.getParameter);
router.put('/parameters/:name', remoteConfigController.updateParameter);
router.delete('/parameters/:name', remoteConfigController.deleteParameter);

// Metadata route
router.get('/metadata', remoteConfigController.getTemplateMetadata);

// Version history routes
router.get('/versions', remoteConfigController.getVersionHistory);
router.get('/versions/:version', remoteConfigController.getVersionHistory);
router.post('/rollback/:version', remoteConfigController.rollbackToVersion);

module.exports = router;
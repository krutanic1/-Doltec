const { getOverview, listWorkspaceProperties, listPackages, getCurrentPlan } = require('../services/sellerWorkspaceService');

exports.getOverview = async (req, res) => {
  try {
    const data = await getOverview(req.user);
    return res.status(200).json({ success: true, ...data });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to load workspace overview',
    });
  }
};

exports.listProperties = async (req, res) => {
  try {
    const data = await listWorkspaceProperties(req.user, req.query);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to load workspace properties',
    });
  }
};

exports.listPackages = async (req, res) => {
  try {
    const data = await listPackages(req.user);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to load listing packages',
    });
  }
};

exports.getCurrentPlan = async (req, res) => {
  try {
    const data = await getCurrentPlan(req.user);
    return res.status(200).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Unable to load current plan',
    });
  }
};
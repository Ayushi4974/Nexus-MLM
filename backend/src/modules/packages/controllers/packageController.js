const packageService = require('../services/packageService');

class PackageController {
  async createPackage(req, res) {
    try {
      const pkg = await packageService.createPackage(req.body);
      return res.status(201).json({ success: true, data: pkg });
    } catch (error) {
      console.error('Create package error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updatePackage(req, res) {
    try {
      const { id } = req.params;
      const updated = await packageService.updatePackage(id, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Update package error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async deletePackage(req, res) {
    try {
      const { id } = req.params;
      await packageService.deletePackage(id);
      return res.status(200).json({ success: true, message: 'Package deleted' });
    } catch (error) {
      console.error('Delete package error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllPackages(req, res) {
    try {
      const packages = await packageService.getAllPackages();
      return res.status(200).json({ success: true, data: packages });
    } catch (error) {
      console.error('Get packages error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPackageById(req, res) {
    try {
      const { id } = req.params;
      const pkg = await packageService.getPackageById(id);
      if (!pkg) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }
      return res.status(200).json({ success: true, data: pkg });
    } catch (error) {
      console.error('Get package by ID error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async buyPackage(req, res) {
    try {
      const userId = req.user.id; // assuming protect middleware adds user
      const { packageId } = req.body;
      const result = await packageService.buyPackage(userId, packageId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Buy package error:', error);
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }
}

module.exports = new PackageController();

const User = require('../models/User')

// Updates a user's profile information in the database
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {
      preferences: req.body.preferences,
      commonMedications: req.body.commonMedications,
      commonTriggers: req.body.commonTriggers,
      notificationSettings: req.body.notificationSettings
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })

    res.json({ message: 'Profile updated successfully', user })
  } catch (err) {
    next(err);
  }
}
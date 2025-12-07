const StudySession = require('../models/StudySession');

exports.saveSession = async (req, res) => {
  try {
    const { duration } = req.body; 

    // Create a new session record
    const newSession = new StudySession({
      user: req.user.id, 
      duration
    });

    const session = await newSession.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
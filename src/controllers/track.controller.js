
const Track = require('../models/track.model');

exports.createTrack = async (req, res) => {
  try {
    const track = await Track.create(req.body);
    res.json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTracks = async (req, res) => {
  const tracks = await Track.findAll();
  res.json(tracks);
};

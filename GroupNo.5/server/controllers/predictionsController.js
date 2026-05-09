const Prediction = require('../models/Prediction');

exports.getAll = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? { $or: [
          { episodeTitle:  { $regex: q, $options: 'i' } },
          { interpretation:{ $regex: q, $options: 'i' } },
        ]}
      : {};
    const predictions = await Prediction.find(filter)
      .populate('submittedBy', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch { res.status(500).json({ message: 'Server error' }); }
};

exports.getOne = async (req, res) => {
  try {
    const p = await Prediction.findById(req.params.id).populate('submittedBy', 'name avatar');
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch { res.status(500).json({ message: 'Server error' }); }
};

exports.create = async (req, res) => {
  try {
    const { episodeNumber, episodeTitle, interpretation, proofImages, timeline, references } = req.body;
    if (!episodeTitle || !interpretation)
      return res.status(400).json({ message: 'Title and interpretation are required' });
    const p = await Prediction.create({
      episodeNumber, episodeTitle, interpretation,
      proofImages: proofImages || [],
      timeline:    timeline    || [],
      references:  references  || [],
      submittedBy: req.user.id,
    });
    res.status(201).json(p);
  } catch { res.status(500).json({ message: 'Server error' }); }
};

exports.update = async (req, res) => {
  try {
    const p = await Prediction.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.submittedBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorised' });
    const updated = await Prediction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch { res.status(500).json({ message: 'Server error' }); }
};

exports.remove = async (req, res) => {
  try {
    const p = await Prediction.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.submittedBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorised' });
    await p.deleteOne();
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
};
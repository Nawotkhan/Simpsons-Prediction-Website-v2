const Review = require('../models/Review');

exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name avatar')   // populate so canModify works on frontend
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    if (!rating || !reviewText)
      return res.status(400).json({ message: 'Rating and review text are required' });

    const review = await Review.create({
      user:       req.user.id,
      username:   req.user.name,   // pulled from JWT payload
      rating,
      reviewText,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const r = await Review.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });

    const isOwner = r.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorised' });

    const { rating, reviewText } = req.body;
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { rating, reviewText } },   // only update allowed fields
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const r = await Review.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });

    const isOwner = r.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorised' });

    await r.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
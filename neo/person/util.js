function requirePersonId(req, res, next) {
  var personId = req.body.personId;

  if (!personId) {
    res.json({success: false, message: 'No person id found'});
    return;
  }

  next();
}
exports.requirePersonId = requirePersonId;

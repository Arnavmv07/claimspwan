const crypto = require('crypto');

function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  // Fail closed if the deployment has no secret configured.
  if (!expected || expected.length < 32) {
    return res.status(503).json({ error: 'Admin writes are disabled' });
  }
  const header = req.get('Authorization') || '';
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!supplied || supplied.length > 256) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  const hash = value => crypto.createHash('sha256').update(value).digest();
  if (!crypto.timingSafeEqual(hash(supplied), hash(expected))) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  next();
}

module.exports = { requireAdmin };

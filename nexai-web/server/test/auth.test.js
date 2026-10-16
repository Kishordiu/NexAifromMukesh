const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'unit-test-secret-with-32-characters-minimum';

const { requireAuth, requireRole } = require('../middleware/auth');

function makeResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('requireAuth rejects requests without a bearer token', () => {
  const res = makeResponse();
  let nextCalled = false;

  requireAuth({ headers: {} }, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('requireAuth rejects malformed or expired tokens', () => {
  const res = makeResponse();
  let nextCalled = false;

  requireAuth({ headers: { authorization: 'Bearer not-a-token' } }, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('requireAuth attaches a valid token payload', () => {
  const user = { id: 'test-user', email: 'patient@example.test', role: 'patient' };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1m' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = makeResponse();
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(req.user.id, user.id);
  assert.equal(req.user.role, user.role);
});

test('requireRole denies a patient access to clinician-only routes', () => {
  const res = makeResponse();
  let nextCalled = false;

  requireRole('clinician')({ user: { role: 'patient' } }, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

import jwt from 'jsonwebtoken';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request) {
  const token = request.cookies.get('sa_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
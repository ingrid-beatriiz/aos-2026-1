import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.context.me = null;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'chave-secreta-padrao';
    const decoded = jwt.verify(token, secret);

    const user = await req.context.models.User.findByPk(decoded.id);
    req.context.me = user;
  } catch (error) {
    req.context.me = null;
  }

  return next();
};

const protectRoutes = (req, res, next) => {
  const { method, path } = req;

  const isWhitelist = 
    (method === 'POST' && path === '/session') ||
    (method === 'POST' && path === '/session/refresh') ||
    (method === 'POST' && path === '/users');

  if (isWhitelist) {
    return next();
  }

  if (method === 'GET' && path === '/session') {
    if (!req.context.me) {
      return res.status(401).send({ error: 'Acesso negado. Utilizador não autenticado.' });
    }
    return next();
  }

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    if (!req.context.me) {
      return res.status(401).send({ error: 'Acesso negado. Esta operação exige autenticação.' });
    }
  }

  return next();
};

export { authMiddleware, protectRoutes };
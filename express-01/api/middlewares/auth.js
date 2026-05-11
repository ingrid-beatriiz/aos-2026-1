import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const publicRoutes = [
    { path: '/session', method: 'POST' },
    { path: '/users', method: 'POST' }
  ];

  const isPublicRoute = publicRoutes.some(
    route => req.path === route.path && req.method === route.method
  );

  if (isPublicRoute) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Acesso não autorizado. Token ausente ou formato inválido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await req.context.models.User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).send({ error: 'Acesso não autorizado. Utilizador não encontrado.' });
    }

    req.context.me = user;
    return next();
  } catch (error) {
    return res.status(401).send({ error: 'Acesso não autorizado. Token inválido ou expirado.' });
  }
};

export default authMiddleware;
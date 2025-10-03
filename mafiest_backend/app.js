const express = require('express');
const cors = require('cors');
const middleware = require('./utils/middleware');

// Import routers
const grabacionesRouter = require('./controllers/grabaciones');
const asesoriasRouter = require('./controllers/asesorias');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const contactsRouter = require('./controllers/contacts');
const actividadesRouter = require('./controllers/actividadesRouters');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/grabaciones', grabacionesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/actividades', actividadesRouter);
app.use('/api/asesorias', asesoriasRouter);

// Error handling
app.use(middleware.errorHandler);

module.exports = app;

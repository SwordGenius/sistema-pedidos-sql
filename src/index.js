const express = require('express');
const app = express();
const cors = require('cors');
const clientRoutes = require('./routes/cliente.route');
const pedidoRoutes = require('./routes/pedido.route');
const resenaRoutes = require('./routes/resena.route');
const authRoutes = require('./routes/auth.route');

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(cors(
    {
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(express.json());

// Routes
app.use('/cliente', clientRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/resena', resenaRoutes);
app.use('/auth', authRoutes);

// Starting the server

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
}
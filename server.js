const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Base de Datos (PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Inicializar tablas si no existen
const initDB = async () => {
    try {
        const client = await pool.connect();
        try {
            // Tabla de Sesiones
            await client.query(`
                CREATE TABLE IF NOT EXISTS "session" (
                    "sid" varchar NOT NULL COLLATE "default",
                    "sess" json NOT NULL,
                    "expire" timestamp(6) NOT NULL,
                    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
                )
                WITH (OIDS=FALSE);
                
                CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
            `);

            // Tabla de Tokens
            await client.query(`
                CREATE TABLE IF NOT EXISTS tokens (
                    token TEXT PRIMARY KEY,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    created_by TEXT,
                    usage_count INTEGER DEFAULT 0,
                    last_used TIMESTAMP WITH TIME ZONE
                );
            `);
            console.log('Database initialized successfully');
        } finally {
            client.release();
        }
    } catch (err) {
        // Ignorar error si la tabla ya existe (constraint violation)
        if (err.code !== '42P07') {
            console.error('Error initializing database:', err);
        }
    }
};
initDB();

// Configuración de Seguridad y Auth
const API_TOKEN = process.env.API_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const ALLOWED_USER = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
};
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM;

const resend = new Resend(RESEND_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Session con PostgreSQL Store
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true en prod (Netlify https)
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    } 
}));

// Middleware para verificar autenticación de sesión
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Servir archivos estáticos PÚBLICOS (login.html, script.js, css)
app.use(express.static('public'));

// Ruta principal protegida (Index)
app.get('/', requireAuth, (req, res) => {
    // Usar process.cwd() es más seguro para encontrar la carpeta protected tanto local como en Lambda
    const indexPath = path.join(process.cwd(), 'protected', 'index.html');
    res.sendFile(indexPath);
});

// Endpoint Login: Paso 1 (Validar credenciales y enviar código)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === ALLOWED_USER.email && password === ALLOWED_USER.password) {
        // Generar código de 6 dígitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Guardar código en sesión
        req.session.tempAuth = {
            email: email,
            code: verificationCode
        };

        try {
            const { data, error } = await resend.emails.send({
                from: MAIL_FROM,
                to: [email],
                subject: 'Código de Verificación - Consulta DNI',
                html: `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p><p>Este código expira en breve.</p>`
            });

            if (error) {
                console.error('Resend Error:', error);
                return res.status(500).json({ success: false, message: 'Error enviando correo de verificación' });
            }

            res.json({ success: true, message: 'Código enviado' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error interno al enviar correo' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});

// Endpoint Verificar Código: Paso 2
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (req.session.tempAuth && 
        req.session.tempAuth.email === email && 
        req.session.tempAuth.code === code) {
        
        // Autenticación exitosa
        req.session.isAuthenticated = true;
        req.session.user = email;
        delete req.session.tempAuth; // Limpiar temporal

        res.json({ success: true, message: 'Autenticado correctamente' });
    } else {
        res.status(400).json({ success: false, message: 'Código inválido o expirado' });
    }
});

// Endpoint para generar Token API (requiere sesión)
app.post('/api/generate-token', requireAuth, async (req, res) => {
    try {
        // Generar un token que expira en 30 días
        const token = jwt.sign(
            { user: req.session.user, type: 'api_access' }, 
            JWT_SECRET, 
            { expiresIn: '30d' }
        );
        
        // Guardar token en DB
        const result = await pool.query(
            'INSERT INTO tokens (token, created_by, usage_count) VALUES ($1, $2, 0) RETURNING *',
            [token, req.session.user]
        );
        
        res.json({ 
            success: true, 
            token: token,
            message: 'Token generado correctamente. Expira en 30 días.'
        });
    } catch (error) {
        console.error('Error generando token:', error);
        res.status(500).json({ success: false, message: 'Error generando token' });
    }
});

// Endpoint para listar tokens (requiere sesión)
app.get('/api/tokens', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tokens ORDER BY created_at DESC');
        const tokens = result.rows;

        // No enviamos el token completo para seguridad en visualización, solo los últimos caracteres
        const safeTokens = tokens.map(t => ({
            ...t,
            displayToken: `...${t.token.slice(-10)}`, // Mostrar solo últimos 10 caracteres
            fullToken: t.token // Enviamos el full para que el cliente decida si mostrarlo o usarlo como ID para borrar
        }));
        res.json({ success: true, tokens: safeTokens });
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ success: false, message: 'Error al obtener tokens' });
    }
});

// Endpoint para eliminar token (requiere sesión)
app.delete('/api/tokens/:token', requireAuth, async (req, res) => {
    const tokenToDelete = req.params.token;
    
    try {
        const result = await pool.query('DELETE FROM tokens WHERE token = $1 RETURNING *', [tokenToDelete]);
        
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Token eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Token no encontrado' });
        }
    } catch (error) {
        console.error('Error deleting token:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar token' });
    }
});

// Middleware de autenticación API (Bearer Token o Sesión)
const authenticateApiOrSession = async (req, res, next) => {
    // Si tiene sesión válida, pasar
    if (req.session.isAuthenticated) return next();

    // Si no, verificar Bearer token (para uso programático externo)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'No autorizado' });

    // 1. Verificar Token Estático (Legacy)
    if (token === API_TOKEN) return next();

    // 2. Verificar JWT Generado
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Verificar si el token existe en la DB (no ha sido revocado)
        const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [token]);
        
        if (result.rows.length === 0) {
            return res.status(403).json({ success: false, message: 'Token revocado o no encontrado' });
        }

        // Incrementar contador de uso
        await pool.query(
            'UPDATE tokens SET usage_count = usage_count + 1, last_used = NOW() WHERE token = $1',
            [token]
        );

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
    }
};

app.post('/api/buscar-dni', authenticateApiOrSession, async (req, res) => {
    const { dni, nombres, apellido_paterno, apellido_materno, security, cc_token, cc_sig } = req.body;

    // Validación básica: al menos DNI o nombre completo
    if (!dni && (!nombres || !apellido_paterno || !apellido_materno)) {
        return res.status(400).json({ success: false, message: 'Debe ingresar DNI o Nombres y Apellidos completos' });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('action', 'buscar_dni');
        
        if (dni) {
            formData.append('dni', dni);
        } else {
            formData.append('nombres', nombres);
            formData.append('apellido_paterno', apellido_paterno);
            formData.append('apellido_materno', apellido_materno);
        }

        formData.append('security', security || '37ea666f56');
        formData.append('cc_token', cc_token || 'f7ce510e99a3cb26b98d90c3514659ca');
        formData.append('cc_sig', cc_sig || '761d4f9306bc19a678a7b8708b1d0374e0ba967712748636ea722e25e6f6235c');

        const response = await axios.post('https://dniperu.com/wp-admin/admin-ajax.php', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'https://dniperu.com',
                'Referer': 'https://dniperu.com/'
            }
        });

        // Si la búsqueda inicial fue exitosa y tenemos resultados
        if (response.data && response.data.success && response.data.data && response.data.data.resultados && response.data.data.resultados.length > 0) {
            const firstResult = response.data.data.resultados[0];
            const dniEncontrado = firstResult.numero;

            try {
                // Segunda llamada a Factiliza
                const factilizaResponse = await axios.get(`https://api.factiliza.com/v1/dni/info/${dniEncontrado}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.FACTILIZA_TOKEN}`
                    }
                });

                // Check if Factiliza logically succeeded
                if (!factilizaResponse.data || !factilizaResponse.data.success) {
                    throw new Error('Factiliza API returned unsuccessful response');
                }

                // Devolvemos la respuesta de Factiliza combinada con la lista original si se desea, 
                // o solo la respuesta de Factiliza como "mejor resultado".
                // Aquí devolveremos una estructura que contenga ambos para mayor flexibilidad.
                res.json({
                    success: true,
                    source: 'factiliza',
                    data: factilizaResponse.data.data, // Datos detallados de Factiliza
                    original_results: response.data.data.resultados // Resultados de la búsqueda por nombre
                });
                return;

            } catch (factilizaError) {
                console.error('Error fetching from Factiliza:', factilizaError.message);
                // Si falla Factiliza, devolvemos al menos lo que encontramos en dniperu
                res.json({
                    success: true,
                    source: 'dniperu_fallback',
                    data: firstResult,
                    original_results: response.data.data.resultados,
                    message: 'No se pudo obtener detalles adicionales de Factiliza. Se muestran datos básicos.'
                });
                return;
            }
        }

        res.json(response.data);

    } catch (error) {
        console.error('Error fetching data:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            res.status(error.response.status).json({ success: false, message: 'Error en la solicitud externa', details: error.response.data });
        } else {
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;

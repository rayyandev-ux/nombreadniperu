module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "pool",
    ()=>pool,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
// Only throw in runtime (not build time) if we actually try to connect and fail, 
// OR if you prefer, keep the check but make it optional for build
if (!process.env.DATABASE_URL && ("TURBOPACK compile-time value", "development") !== 'production') {
    console.warn('DATABASE_URL is missing - using placeholder for build/dev');
}
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/utils/dniPeruAuth.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const axios = __turbopack_context__.r("[project]/node_modules/axios/dist/node/axios.cjs [app-route] (ecmascript)");
// Cache simple en memoria para los tokens
let cachedTokens = null;
/**
 * Obtiene los tokens de seguridad de dniperu.com.
 * Si forceRefresh es true, ignora el cache y busca nuevos tokens.
 */ async function getDniPeruTokens(forceRefresh = false) {
    if (cachedTokens && !forceRefresh) {
        return cachedTokens;
    }
    try {
        console.log('Obteniendo tokens de seguridad de dniperu.com...');
        const response = await axios.get('https://dniperu.com/buscar-dni-por-nombre/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://dniperu.com/'
            },
            timeout: 5000
        });
        const html = response.data;
        // Buscamos la variable dni_vars que contiene los tokens
        const dniVarsMatch = html.match(/var dni_vars = ({[^;]+});/);
        if (dniVarsMatch && dniVarsMatch[1]) {
            try {
                const data = JSON.parse(dniVarsMatch[1]);
                const tokens = {
                    security: data.nonce,
                    cc_token: data.ephemeral_token,
                    cc_sig: data.ephemeral_sig
                };
                if (tokens.security && tokens.cc_token && tokens.cc_sig) {
                    console.log('Tokens obtenidos exitosamente:', tokens);
                    cachedTokens = tokens; // Guardamos en cache
                    return tokens;
                }
            } catch (e) {
                console.error('Error parseando JSON de dni_vars:', e.message);
            }
        } else {
            console.warn('No se encontró la variable dni_vars en el HTML');
        }
        return null;
    } catch (error) {
        console.error('Error conectando con dniperu.com para obtener tokens:', error.message);
        return null;
    }
}
/**
 * Realiza la búsqueda en DniPeru manejando tokens y reintentos en caso de 403.
 * @param {Object} params - { nombres, apellido_paterno, apellido_materno }
 */ async function searchDniPeru(params) {
    let tokens = await getDniPeruTokens();
    // Si no hay tokens ni siquiera tras intentar obtenerlos, usamos fallbacks (aunque probablemente fallen)
    let security = tokens?.security || '37ea666f56';
    let cc_token = tokens?.cc_token || 'f7ce510e99a3cb26b98d90c3514659ca';
    let cc_sig = tokens?.cc_sig || '761d4f9306bc19a678a7b8708b1d0374e0ba967712748636ea722e25e6f6235c';
    const makeRequest = async (currentSecurity, currentCcToken, currentCcSig)=>{
        const formData = new URLSearchParams();
        formData.append('action', 'buscar_dni');
        if (params.nombres) formData.append('nombres', params.nombres);
        if (params.apellido_paterno) formData.append('apellido_paterno', params.apellido_paterno);
        if (params.apellido_materno) formData.append('apellido_materno', params.apellido_materno);
        formData.append('security', currentSecurity);
        formData.append('cc_token', currentCcToken);
        formData.append('cc_sig', currentCcSig);
        return axios.post('https://dniperu.com/wp-admin/admin-ajax.php', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Origin': 'https://dniperu.com',
                'Referer': 'https://dniperu.com/',
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 8000
        });
    };
    try {
        // Primer intento
        return await makeRequest(security, cc_token, cc_sig);
    } catch (error) {
        // Si es error 403, intentamos refrescar tokens y reintentar una vez
        if (error.response && error.response.status === 403) {
            console.log('Error 403 detectado. Refrescando tokens y reintentando...');
            tokens = await getDniPeruTokens(true); // Forzar refresh
            if (tokens) {
                security = tokens.security;
                cc_token = tokens.cc_token;
                cc_sig = tokens.cc_sig;
                // Segundo intento
                return await makeRequest(security, cc_token, cc_sig);
            }
        }
        // Si no es 403 o falló el refresh, lanzamos el error original
        throw error;
    }
}
module.exports = {
    getDniPeruTokens,
    searchDniPeru
};
}),
"[project]/app/api/buscar-dni/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
// @ts-ignore
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$dniPeruAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/dniPeruAuth.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const API_TOKEN = process.env.API_TOKEN;
// Helper to validate request (Bearer or Cookie)
async function isAuthenticated(request) {
    // 1. Check Cookie (Dashboard use)
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const cookieAuth = cookieStore.get('auth_token');
    if (cookieAuth) {
        try {
            const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(cookieAuth.value, JWT_SECRET);
            return {
                type: 'session',
                user: decoded
            };
        } catch (e) {}
    }
    // 2. Check Bearer Token (API use)
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return null;
    // Legacy static token
    if (token === API_TOKEN) return {
        type: 'static',
        token
    };
    // Database JWT
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
        // Verify DB
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('SELECT * FROM tokens WHERE token = $1', [
            token
        ]);
        if (result.rows.length === 0) return null;
        // Update usage
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('UPDATE tokens SET usage_count = usage_count + 1, last_used = NOW() WHERE token = $1', [
            token
        ]);
        return {
            type: 'api',
            user: decoded
        };
    } catch (e) {
        return null;
    }
}
async function POST(request) {
    const auth = await isAuthenticated(request);
    if (!auth) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'No autorizado'
        }, {
            status: 401
        });
    }
    try {
        const body = await request.json();
        const { dni, nombres, apellido_paterno, apellido_materno, security, cc_token, cc_sig } = body;
        // Load user settings if authenticated via DB token
        let factilizaToken = process.env.FACTILIZA_TOKEN;
        let dniPeruConfig = {
            security: security || '37ea666f56',
            cc_token: cc_token || 'f7ce510e99a3cb26b98d90c3514659ca',
            cc_sig: cc_sig || '761d4f9306bc19a678a7b8708b1d0374e0ba967712748636ea722e25e6f6235c'
        };
        const authUser = auth.user;
        if (authUser?.user) {
            try {
                const settingsRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('SELECT * FROM user_settings WHERE user_id = $1', [
                    authUser.user
                ]);
                if (settingsRes.rows.length > 0) {
                    const s = settingsRes.rows[0];
                    if (s.factiliza_token) factilizaToken = s.factiliza_token;
                    if (s.dniperu_security) dniPeruConfig.security = s.dniperu_security;
                    if (s.dniperu_cc_token) dniPeruConfig.cc_token = s.dniperu_cc_token;
                    if (s.dniperu_cc_sig) dniPeruConfig.cc_sig = s.dniperu_cc_sig;
                }
            } catch (e) {
                console.error('Error loading user settings:', e);
            }
        }
        if (!dni && (!nombres || !apellido_paterno || !apellido_materno)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Debe ingresar DNI o Nombres y Apellidos'
            }, {
                status: 400
            });
        }
        // --- CACHE LOGIC START ---
        let cacheKey = '';
        const generateNameKey = (n, p, m)=>{
            return `NAME:${n?.trim().toUpperCase() || ''}|${p?.trim().toUpperCase() || ''}|${m?.trim().toUpperCase() || ''}`;
        };
        if (dni) {
            cacheKey = `DNI:${dni.trim()}`;
        } else {
            cacheKey = generateNameKey(nombres, apellido_paterno, apellido_materno);
        }
        try {
            const cacheResult = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('SELECT data FROM search_cache WHERE query_key = $1', [
                cacheKey
            ]);
            if (cacheResult.rows.length > 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    source: 'cache',
                    data: cacheResult.rows[0].data,
                    message: 'Data recuperada de cache'
                });
            }
        } catch (e) {
            console.error('Cache read error:', e);
        // Continue without cache if error
        }
        // --- CACHE LOGIC END ---
        let debugErrors = {};
        let finalData = null;
        // 1. DNI Search (Factiliza)
        if (dni) {
            try {
                const factilizaResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(`https://api.factiliza.com/v1/dni/info/${dni}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.FACTILIZA_TOKEN}`
                    },
                    timeout: 5000
                });
                if (factilizaResponse.data?.success) {
                    finalData = factilizaResponse.data.data;
                    // Save to cache (DNI Key)
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                            cacheKey,
                            finalData
                        ]);
                    } catch (e) {
                        console.error('Cache write error:', e);
                    }
                    // SMART CACHE: Also save by Name
                    if (finalData.nombres && finalData.apellido_paterno && finalData.apellido_materno) {
                        const nameKey = generateNameKey(finalData.nombres, finalData.apellido_paterno, finalData.apellido_materno);
                        try {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                                nameKey,
                                finalData
                            ]);
                        } catch (e) {
                            console.error('Smart Cache (Name) write error:', e);
                        }
                    }
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: true,
                        source: 'factiliza',
                        data: finalData,
                        original_results: []
                    });
                }
                debugErrors.factiliza = 'Success false';
            } catch (error) {
                debugErrors.factiliza = error.message;
            }
        }
        // 2. Name Search (DniPeru) -> Solo si no hay DNI
        if (!dni && (nombres || apellido_paterno || apellido_materno)) {
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$dniPeruAuth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchDniPeru"])({
                    nombres,
                    apellido_paterno,
                    apellido_materno
                });
                if (response.data?.success && response.data.data?.resultados?.length > 0) {
                    const datos = response.data.data.resultados[0];
                    finalData = datos;
                    // Enrich with Factiliza if DNI found
                    if (datos.numero) {
                        // SMART CACHE: Check if DNI is already cached before calling Factiliza
                        const dniKey = `DNI:${datos.numero.trim()}`;
                        let cachedDniData = null;
                        try {
                            const dniCacheRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('SELECT data FROM search_cache WHERE query_key = $1', [
                                dniKey
                            ]);
                            if (dniCacheRes.rows.length > 0) {
                                cachedDniData = dniCacheRes.rows[0].data;
                            }
                        } catch (e) {}
                        if (cachedDniData) {
                            finalData = cachedDniData;
                            // Update Name Cache with this high-quality data
                            try {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                                    cacheKey,
                                    finalData
                                ]);
                            } catch (e) {
                                console.error('Cache write error:', e);
                            }
                            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                success: true,
                                source: 'cache_via_dni_lookup',
                                data: finalData,
                                original_results: [
                                    datos
                                ]
                            });
                        } else {
                            // Not in cache, call Factiliza
                            try {
                                const fRes = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(`https://api.factiliza.com/v1/dni/info/${datos.numero}`, {
                                    headers: {
                                        'Authorization': `Bearer ${factilizaToken}`
                                    },
                                    timeout: 5000
                                });
                                if (fRes.data?.success) {
                                    finalData = fRes.data.data;
                                    // Save to cache (Name Key)
                                    try {
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                                            cacheKey,
                                            finalData
                                        ]);
                                    } catch (e) {
                                        console.error('Cache write error:', e);
                                    }
                                    // SMART CACHE: Also save by DNI
                                    try {
                                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                                            dniKey,
                                            finalData
                                        ]);
                                    } catch (e) {
                                        console.error('Smart Cache (DNI) write error:', e);
                                    }
                                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                        success: true,
                                        source: 'factiliza_via_name',
                                        data: finalData,
                                        original_results: [
                                            datos
                                        ]
                                    });
                                }
                            } catch (e) {}
                        }
                    }
                    // Save to cache (raw data if enrichment failed or no DNI)
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query('INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()', [
                            cacheKey,
                            finalData
                        ]);
                    } catch (e) {
                        console.error('Cache write error:', e);
                    }
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: true,
                        source: 'dniperu',
                        data: finalData,
                        original_results: [
                            datos
                        ]
                    });
                }
                debugErrors.dniPeru = 'No results';
            } catch (error) {
                debugErrors.dniPeru = error.message;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'No se encontraron resultados',
            debug: debugErrors
        }, {
            status: 404
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error interno',
            details: error.message
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eba5b80b._.js.map
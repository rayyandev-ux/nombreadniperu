const axios = require('axios');

// Cache simple en memoria para los tokens
let cachedTokens = null;

/**
 * Obtiene los tokens de seguridad de dniperu.com.
 * Si forceRefresh es true, ignora el cache y busca nuevos tokens.
 */
async function getDniPeruTokens(forceRefresh = false) {
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
 */
async function searchDniPeru(params) {
    let tokens = await getDniPeruTokens();
    
    // Si no hay tokens ni siquiera tras intentar obtenerlos, usamos fallbacks (aunque probablemente fallen)
    let security = tokens?.security || '37ea666f56';
    let cc_token = tokens?.cc_token || 'f7ce510e99a3cb26b98d90c3514659ca';
    let cc_sig = tokens?.cc_sig || '761d4f9306bc19a678a7b8708b1d0374e0ba967712748636ea722e25e6f6235c';

    const makeRequest = async (currentSecurity, currentCcToken, currentCcSig) => {
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

module.exports = { getDniPeruTokens, searchDniPeru };

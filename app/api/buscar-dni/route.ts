import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const API_TOKEN = process.env.API_TOKEN;

// Helper to validate request (Bearer or Cookie)
async function isAuthenticated(request: Request) {
  // 1. Check Cookie (Dashboard use)
  const cookieStore = await cookies();
  const cookieAuth = cookieStore.get('auth_token');
  if (cookieAuth) {
    try {
      const decoded = jwt.verify(cookieAuth.value, JWT_SECRET);
      return { type: 'session', user: decoded };
    } catch (e) {}
  }

  // 2. Check Bearer Token (API use)
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;

  // Legacy static token
  if (token === API_TOKEN) return { type: 'static', token };

  // Database JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Verify DB
    const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [token]);
    if (result.rows.length === 0) return null;
    
    // Update usage
    await pool.query(
      'UPDATE tokens SET usage_count = usage_count + 1, last_used = NOW() WHERE token = $1',
      [token]
    );
    return { type: 'api', user: decoded };
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  const auth = await isAuthenticated(request);
  if (!auth) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
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

    const authUser = auth.user as any;
    if (authUser?.user) { // If we have a user ID (from dashboard session or user-tied token)
        try {
            const settingsRes = await pool.query('SELECT * FROM user_settings WHERE user_id = $1', [authUser.user]);
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
        return NextResponse.json({ success: false, message: 'Debe ingresar DNI o Nombres y Apellidos' }, { status: 400 });
    }

    // --- CACHE LOGIC START ---
    let cacheKey = '';
    const generateNameKey = (n: string, p: string, m: string) => {
        return `NAME:${n?.trim().toUpperCase() || ''}|${p?.trim().toUpperCase() || ''}|${m?.trim().toUpperCase() || ''}`;
    };

    if (dni) {
        cacheKey = `DNI:${dni.trim()}`;
    } else {
        cacheKey = generateNameKey(nombres, apellido_paterno, apellido_materno);
    }

    try {
        const cacheResult = await pool.query('SELECT data FROM search_cache WHERE query_key = $1', [cacheKey]);
        if (cacheResult.rows.length > 0) {
            return NextResponse.json({
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

    let debugErrors: any = {};
    let finalData = null;

    // 1. DNI Search (Factiliza)
    if (dni) {
        try {
            const factilizaResponse = await axios.get(`https://api.factiliza.com/v1/dni/info/${dni}`, {
                headers: { 'Authorization': `Bearer ${process.env.FACTILIZA_TOKEN}` },
                timeout: 5000
            });

            if (factilizaResponse.data?.success) {
                finalData = factilizaResponse.data.data;
                 
                // Save to cache (DNI Key)
                try {
                     await pool.query(
                        'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                        [cacheKey, finalData]
                    );
                } catch (e) { console.error('Cache write error:', e); }

                // SMART CACHE: Also save by Name
                if (finalData.nombres && finalData.apellido_paterno && finalData.apellido_materno) {
                    const nameKey = generateNameKey(finalData.nombres, finalData.apellido_paterno, finalData.apellido_materno);
                    try {
                        await pool.query(
                           'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                           [nameKey, finalData]
                       );
                   } catch (e) { console.error('Smart Cache (Name) write error:', e); }
                }

                 return NextResponse.json({
                    success: true,
                    source: 'factiliza',
                    data: finalData,
                    original_results: []
                });
            }
            debugErrors.factiliza = 'Success false';
        } catch (error: any) {
            debugErrors.factiliza = error.message;
        }
    }

    // 2. Name Search (DniPeru)
    if (!dni && (nombres || apellido_paterno || apellido_materno)) {
        try {
             const formData = new URLSearchParams();
            formData.append('action', 'buscar_dni');
            if(nombres) formData.append('nombres', nombres);
            if(apellido_paterno) formData.append('apellido_paterno', apellido_paterno);
            if(apellido_materno) formData.append('apellido_materno', apellido_materno);
            formData.append('security', security || '37ea666f56');
            formData.append('cc_token', cc_token || 'f7ce510e99a3cb26b98d90c3514659ca');
            formData.append('cc_sig', cc_sig || '761d4f9306bc19a678a7b8708b1d0374e0ba967712748636ea722e25e6f6235c');

            const response = await axios.post('https://dniperu.com/wp-admin/admin-ajax.php', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Origin': 'https://dniperu.com',
                    'Referer': 'https://dniperu.com/',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 8000
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
                         const dniCacheRes = await pool.query('SELECT data FROM search_cache WHERE query_key = $1', [dniKey]);
                         if (dniCacheRes.rows.length > 0) {
                             cachedDniData = dniCacheRes.rows[0].data;
                         }
                     } catch(e) {}

                     if (cachedDniData) {
                         finalData = cachedDniData;
                         // Update Name Cache with this high-quality data
                         try {
                            await pool.query(
                                'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                                [cacheKey, finalData]
                            );
                        } catch (e) { console.error('Cache write error:', e); }

                         return NextResponse.json({
                            success: true,
                            source: 'cache_via_dni_lookup',
                            data: finalData,
                            original_results: [datos]
                        });
                     } else {
                         // Not in cache, call Factiliza
                         try {
                            const fRes = await axios.get(`https://api.factiliza.com/v1/dni/info/${datos.numero}`, {
                                headers: { 'Authorization': `Bearer ${factilizaToken}` },
                                timeout: 5000
                            });
                            if (fRes.data?.success) {
                                finalData = fRes.data.data;
                                
                                // Save to cache (Name Key)
                                try {
                                    await pool.query(
                                        'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                                        [cacheKey, finalData]
                                    );
                                } catch (e) { console.error('Cache write error:', e); }

                                // SMART CACHE: Also save by DNI
                                try {
                                    await pool.query(
                                        'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                                        [dniKey, finalData]
                                    );
                                } catch (e) { console.error('Smart Cache (DNI) write error:', e); }

                                return NextResponse.json({
                                    success: true,
                                    source: 'factiliza_via_name',
                                    data: finalData,
                                    original_results: [datos]
                                });
                            }
                         } catch (e) {}
                     }
                 }

                 // Save to cache (raw data if enrichment failed or no DNI)
                 try {
                    await pool.query(
                        'INSERT INTO search_cache (query_key, data) VALUES ($1, $2) ON CONFLICT (query_key) DO UPDATE SET data = $2, created_at = NOW()',
                        [cacheKey, finalData]
                    );
                } catch (e) { console.error('Cache write error:', e); }

                 return NextResponse.json({
                    success: true,
                    source: 'dniperu',
                    data: finalData,
                    original_results: [datos]
                });
            }
            debugErrors.dniPeru = 'No results';
        } catch (error: any) {
            debugErrors.dniPeru = error.message;
        }
    }

    return NextResponse.json({ success: false, message: 'No se encontraron resultados', debug: debugErrors }, { status: 404 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error interno', details: error.message }, { status: 500 });
  }
}

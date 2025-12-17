document.getElementById('dniForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = document.getElementById('nombres').value;
    const apellido_paterno = document.getElementById('apellido_paterno').value;
    const apellido_materno = document.getElementById('apellido_materno').value;
    
    const security = document.getElementById('security').value;
    const cc_token = document.getElementById('cc_token').value;
    const cc_sig = document.getElementById('cc_sig').value;

    const initialState = document.getElementById('initialState');
    const loadingState = document.getElementById('loadingState');
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Reset UI
    initialState.classList.add('hidden');
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Consultando...
    `;

    try {
        const response = await fetch('/api/buscar-dni', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombres, apellido_paterno, apellido_materno, security, cc_token, cc_sig })
        });

        const data = await response.json();

        loadingState.classList.add('hidden');

        if (data.success) {
            resultDiv.classList.remove('hidden');
            
            // Helper function to create rows
            const createRow = (label, value) => `
                <div class="flex flex-col sm:flex-row border-b border-gray-100 last:border-0 py-3 px-4 hover:bg-gray-50 transition-colors">
                    <span class="text-xs sm:text-sm font-semibold text-gray-500 w-full sm:w-1/3 uppercase tracking-wider">${label}</span>
                    <span class="text-sm sm:text-base text-gray-800 font-medium w-full sm:w-2/3 break-words">${value || '-'}</span>
                </div>
            `;

            // Handle enriched Factiliza data
            if (data.source === 'factiliza' && data.data) {
                const p = data.data;
                resultContent.innerHTML = `
                    <div class="bg-blue-600 px-4 py-3 flex justify-between items-center">
                        <span class="text-white font-bold tracking-wide">INFORMACIÓN DETALLADA</span>
                        <span class="bg-blue-500 text-blue-100 text-xs px-2 py-1 rounded-full">Factiliza API</span>
                    </div>
                    <div class="flex-1 overflow-auto bg-white">
                        ${createRow('DNI', p.numero)}
                        ${createRow('Nombre Completo', p.nombre_completo)}
                        ${createRow('Nombres', p.nombres)}
                        ${createRow('Apellido Paterno', p.apellido_paterno)}
                        ${createRow('Apellido Materno', p.apellido_materno)}
                        ${createRow('Departamento', p.departamento)}
                        ${createRow('Provincia', p.provincia)}
                        ${createRow('Distrito', p.distrito)}
                        ${createRow('Dirección', p.direccion_completa || p.direccion)}
                        ${createRow('Ubigeo', `${p.ubigeo_reniec || '-'} / ${p.ubigeo_sunat || '-'}`)}
                    </div>
                `;
            }
            // Handle original format
            else if (data.data && data.data.resultados && data.data.resultados.length > 0) {
                const persona = data.data.resultados[0];
                resultContent.innerHTML = `
                    <div class="bg-yellow-500 px-4 py-3 flex justify-between items-center">
                        <span class="text-white font-bold tracking-wide">INFORMACIÓN BÁSICA</span>
                        <span class="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full">Búsqueda simple</span>
                    </div>
                    <div class="bg-yellow-50 px-4 py-2 text-xs text-yellow-700 border-b border-yellow-100">
                        No se pudo obtener información detallada adicional.
                    </div>
                    <div class="flex-1 overflow-auto bg-white">
                        ${createRow('DNI', persona.numero)}
                        ${createRow('Nombres', persona.nombres)}
                        ${createRow('Apellido Paterno', persona.apellido_paterno)}
                        ${createRow('Apellido Materno', persona.apellido_materno)}
                    </div>
                `;
            } else if (data.source === 'dniperu_fallback') {
                 // Fallback handling if Factiliza failed but we have basic data
                 const persona = data.data;
                 resultContent.innerHTML = `
                    <div class="bg-orange-500 px-4 py-3 flex justify-between items-center">
                        <span class="text-white font-bold tracking-wide">INFORMACIÓN PARCIAL</span>
                        <span class="bg-orange-600 text-orange-100 text-xs px-2 py-1 rounded-full">Fallback</span>
                    </div>
                    <div class="bg-orange-50 px-4 py-2 text-xs text-orange-700 border-b border-orange-100">
                        ${data.message || 'Error al obtener detalles completos.'}
                    </div>
                    <div class="flex-1 overflow-auto bg-white">
                        ${createRow('DNI', persona.numero)}
                        ${createRow('Nombres', persona.nombres)}
                        ${createRow('Apellido Paterno', persona.apellido_paterno)}
                        ${createRow('Apellido Materno', persona.apellido_materno)}
                    </div>
                `;
            } else {
                resultContent.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-gray-500 font-medium">No se encontraron resultados</p>
                        <p class="text-xs text-gray-400 mt-1">Intenta verificar los nombres y apellidos.</p>
                    </div>
                `;
            }
        } else {
            throw new Error(data.message || 'Error en la consulta');
        }
    } catch (err) {
        loadingState.classList.add('hidden');
        errorDiv.classList.remove('hidden');
        errorMessage.textContent = err.message || 'Ocurrió un error al realizar la consulta.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🔍 Buscar Información';
    }
});

// Token Generation Logic
document.getElementById('generateTokenBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateTokenBtn');
    const result = document.getElementById('tokenResult');
    const tokenValue = document.getElementById('tokenValue');
    
    const originalText = btn.textContent;
    btn.textContent = 'Generando...';
    btn.disabled = true;

    try {
        const response = await fetch('/api/generate-token', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            tokenValue.textContent = data.token;
            result.classList.remove('hidden');
            loadTokens(); // Recargar lista de tokens
        } else {
            alert('Error generando token: ' + data.message);
        }
    } catch (err) {
        alert('Error de conexión');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

// Copy Token
document.getElementById('copyTokenBtn').addEventListener('click', () => {
    const token = document.getElementById('tokenValue').textContent;
    navigator.clipboard.writeText(token).then(() => {
        const btn = document.getElementById('copyTokenBtn');
        const original = btn.textContent;
        btn.textContent = 'Copiado!';
        setTimeout(() => btn.textContent = original, 2000);
    });
});

// --- Token Management Logic ---

async function loadTokens() {
    const tbody = document.getElementById('tokensListBody');
    try {
        const response = await fetch('/api/tokens');
        const data = await response.json();
        
        if (data.success) {
            if (data.tokens.length === 0) {
                tbody.innerHTML = `
                    <tr class="bg-white border-b">
                        <td colspan="3" class="px-2 py-2 text-center">No has generado tokens aún.</td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = data.tokens.map(t => `
                <tr class="bg-white border-b hover:bg-gray-50">
                    <td class="px-2 py-2 font-mono text-gray-800" title="${t.createdAt}">
                        ${t.displayToken}
                    </td>
                    <td class="px-2 py-2">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">${t.usageCount || 0}</span>
                    </td>
                    <td class="px-2 py-2">
                        <button onclick="deleteToken('${t.fullToken}')" class="font-medium text-red-600 hover:underline">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="3" class="px-2 py-2 text-center text-red-500">Error cargando tokens</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-2 py-2 text-center text-red-500">Error de conexión</td></tr>`;
    }
}

async function deleteToken(token) {
    if (!confirm('¿Estás seguro de que deseas eliminar este token? Dejará de funcionar inmediatamente.')) return;

    try {
        const response = await fetch(`/api/tokens/${token}`, { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
            loadTokens(); // Recargar lista
        } else {
            alert('Error eliminando token: ' + data.message);
        }
    } catch (error) {
        alert('Error de conexión al eliminar token');
    }
}

// Make deleteToken available globally for the inline onclick handler
window.deleteToken = deleteToken;

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!confirm('¿Desea cerrar sesión?')) return;
        
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                window.location.href = '/login.html';
            } else {
                alert('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });
}

// Load tokens on startup
loadTokens();

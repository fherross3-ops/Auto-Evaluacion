// Elementos DOM
const usuarioActual = document.getElementById('usuarioActual');
const individualChart = document.getElementById('individualChart');
const groupChart = document.getElementById('groupChart');
const comparisonChart = document.getElementById('comparisonChart');
const evaluationsTable = document.getElementById('evaluationsTable');

// Temas disponibles
const temas = [
    { id: 1, nombre: 'HTML5 y Semántica', descripcion: 'Estructura semántica y elementos HTML5' },
    { id: 2, nombre: 'CSS3 y Diseño Responsivo', descripcion: 'Estilos avanzados y adaptabilidad' },
    { id: 3, nombre: 'JavaScript Básico', descripcion: 'Fundamentos de programación en JS' },
    { id: 4, nombre: 'DOM Manipulation', descripcion: 'Interacción con el Document Object Model' },
    { id: 5, nombre: 'APIs y Fetch', descripcion: 'Consumo de APIs y peticiones HTTP' },
    { id: 6, nombre: 'ES6+ Features', descripcion: 'Características modernas de JavaScript' },
    { id: 7, nombre: 'Git y Control de Versiones', descripcion: 'Trabajo colaborativo con Git' },
    { id: 8, nombre: 'Accesibilidad Web', descripcion: 'Desarrollo inclusivo y accesible' },
    { id: 9, nombre: 'Performance Web', descripcion: 'Optimización y rendimiento' },
    { id: 10, nombre: 'Seguridad Web', descripcion: 'Prácticas de seguridad en desarrollo web' }
];

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogueado);
    usuarioActual.textContent = `Usuario: ${usuario.nombre}`;
    
    cargarDashboard(usuario);
});

// Cargar datos del dashboard
function cargarDashboard(usuario) {
    // Obtener resultados (en una implementación real, esto vendría de una API)
    const resultados = JSON.parse(localStorage.getItem('resultadosEvaluaciones')) || [];
    
    // Generar datos de ejemplo si no hay resultados
    if (resultados.length === 0) {
        generarDatosEjemplo(usuario);
    }
    
    const resultadosUsuario = resultados.filter(r => r.usuarioId === usuario.id);
    const todosResultados = resultados;
    
    mostrarProgresoIndividual(resultadosUsuario);
    mostrarPromedioGrupal(todosResultados);
    mostrarComparativa(resultadosUsuario, todosResultados);
    mostrarTablaEvaluaciones(resultadosUsuario);
}

// Mostrar progreso individual
function mostrarProgresoIndividual(resultadosUsuario) {
    individualChart.innerHTML = '';
    
    // Agrupar resultados por tema
    const resultadosPorTema = {};
    
    temas.forEach(tema => {
        resultadosPorTema[tema.id] = resultadosUsuario.filter(r => r.temaId === tema.id);
    });
    
    // Calcular promedio por tema
    temas.forEach(tema => {
        const resultadosTema = resultadosPorTema[tema.id];
        
        if (resultadosTema.length > 0) {
            const promedio = resultadosTema.reduce((sum, r) => sum + r.porcentaje, 0) / resultadosTema.length;
            const altura = (promedio / 100) * 280; // 280px es la altura máxima del gráfico
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${altura}px`;
            bar.style.backgroundColor = promedio >= 70 ? '#2ecc71' : promedio >= 50 ? '#f39c12' : '#e74c3c';
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0]; // Solo la primera palabra para ahorrar espacio
            
            bar.appendChild(label);
            individualChart.appendChild(bar);
            
            // Tooltip
            bar.title = `${tema.nombre}: ${promedio.toFixed(1)}%`;
        } else {
            // Si no hay evaluaciones para este tema
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = '0px';
            bar.style.backgroundColor = '#bdc3c7';
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0];
            
            bar.appendChild(label);
            individualChart.appendChild(bar);
            
            bar.title = `${tema.nombre}: Sin evaluaciones`;
        }
    });
}

// Mostrar promedio grupal
function mostrarPromedioGrupal(todosResultados) {
    groupChart.innerHTML = '';
    
    // Agrupar resultados por tema
    const resultadosPorTema = {};
    
    temas.forEach(tema => {
        resultadosPorTema[tema.id] = todosResultados.filter(r => r.temaId === tema.id);
    });
    
    // Calcular promedio por tema
    temas.forEach(tema => {
        const resultadosTema = resultadosPorTema[tema.id];
        
        if (resultadosTema.length > 0) {
            const promedio = resultadosTema.reduce((sum, r) => sum + r.porcentaje, 0) / resultadosTema.length;
            const altura = (promedio / 100) * 280;
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${altura}px`;
            bar.style.backgroundColor = promedio >= 70 ? '#2ecc71' : promedio >= 50 ? '#f39c12' : '#e74c3c';
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0];
            
            bar.appendChild(label);
            groupChart.appendChild(bar);
            
            bar.title = `${tema.nombre}: ${promedio.toFixed(1)}% (${resultadosTema.length} eval.)`;
        } else {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = '0px';
            bar.style.backgroundColor = '#bdc3c7';
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0];
            
            bar.appendChild(label);
            groupChart.appendChild(bar);
            
            bar.title = `${tema.nombre}: Sin evaluaciones`;
        }
    });
}

// Mostrar comparativa individual vs grupal
function mostrarComparativa(resultadosUsuario, todosResultados) {
    comparisonChart.innerHTML = '';
    
    // Agrupar resultados por tema
    const resultadosUsuarioPorTema = {};
    const resultadosGrupoPorTema = {};
    
    temas.forEach(tema => {
        resultadosUsuarioPorTema[tema.id] = resultadosUsuario.filter(r => r.temaId === tema.id);
        resultadosGrupoPorTema[tema.id] = todosResultados.filter(r => r.temaId === tema.id);
    });
    
    // Calcular promedios por tema
    temas.forEach(tema => {
        const resultadosUsuarioTema = resultadosUsuarioPorTema[tema.id];
        const resultadosGrupoTema = resultadosGrupoPorTema[tema.id];
        
        if (resultadosUsuarioTema.length > 0 && resultadosGrupoTema.length > 0) {
            const promedioUsuario = resultadosUsuarioTema.reduce((sum, r) => sum + r.porcentaje, 0) / resultadosUsuarioTema.length;
            const promedioGrupo = resultadosGrupoTema.reduce((sum, r) => sum + r.porcentaje, 0) / resultadosGrupoTema.length;
            
            // Crear contenedor para las dos barras
            const barContainer = document.createElement('div');
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.width = '40px';
            
            // Barra del usuario
            const barUsuario = document.createElement('div');
            barUsuario.className = 'bar';
            barUsuario.style.height = `${(promedioUsuario / 100) * 120}px`;
            barUsuario.style.width = '15px';
            barUsuario.style.backgroundColor = '#3498db';
            barUsuario.style.marginBottom = '5px';
            barUsuario.title = `Tú: ${promedioUsuario.toFixed(1)}%`;
            
            // Barra del grupo
            const barGrupo = document.createElement('div');
            barGrupo.className = 'bar';
            barGrupo.style.height = `${(promedioGrupo / 100) * 120}px`;
            barGrupo.style.width = '15px';
            barGrupo.style.backgroundColor = '#95a5a6';
            barGrupo.title = `Grupo: ${promedioGrupo.toFixed(1)}%`;
            
            // Etiqueta
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0];
            
            barContainer.appendChild(barUsuario);
            barContainer.appendChild(barGrupo);
            barContainer.appendChild(label);
            
            comparisonChart.appendChild(barContainer);
        } else {
            const barContainer = document.createElement('div');
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.width = '40px';
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = tema.nombre.split(' ')[0];
            
            barContainer.appendChild(label);
            comparisonChart.appendChild(barContainer);
        }
    });
}

// Mostrar tabla de evaluaciones
function mostrarTablaEvaluaciones(resultadosUsuario) {
    evaluationsTable.innerHTML = '';
    
    if (resultadosUsuario.length === 0) {
        evaluationsTable.innerHTML = '<p>No hay evaluaciones realizadas.</p>';
        return;
    }
    
    // Agrupar resultados por tema
    const resultadosPorTema = {};
    
    temas.forEach(tema => {
        resultadosPorTema[tema.id] = resultadosUsuario.filter(r => r.temaId === tema.id);
    });
    
    let tablaHTML = '<table style="width: 100%; border-collapse: collapse;">';
    tablaHTML += '<thead><tr><th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Tema</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Evaluaciones</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Mejor Resultado</th><th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Promedio</th></tr></thead>';
    tablaHTML += '<tbody>';
    
    temas.forEach(tema => {
        const resultadosTema = resultadosPorTema[tema.id];
        
        if (resultadosTema.length > 0) {
            const mejorResultado = Math.max(...resultadosTema.map(r => r.porcentaje));
            const promedio = resultadosTema.reduce((sum, r) => sum + r.porcentaje, 0) / resultadosTema.length;
            
            tablaHTML += `<tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${tema.nombre}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${resultadosTema.length}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${mejorResultado.toFixed(1)}%</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${promedio.toFixed(1)}%</td>
            </tr>`;
        } else {
            tablaHTML += `<tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${tema.nombre}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">0</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">-</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">-</td>
            </tr>`;
        }
    });
    
    tablaHTML += '</tbody></table>';
    
    evaluationsTable.innerHTML = tablaHTML;
}

// Generar datos de ejemplo para demostración
function generarDatosEjemplo(usuario) {
    const resultados = [];
    
    // Generar 3 evaluaciones por tema para el usuario actual
    temas.forEach(tema => {
        for (let i = 0; i < 3; i++) {
            const puntaje = Math.floor(Math.random() * 4) + 1; // 1-4
            const totalPreguntas = 3;
            const porcentaje = (puntaje / totalPreguntas) * 100;
            
            resultados.push({
                usuarioId: usuario.id,
                temaId: tema.id,
                fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
                respuestas: [],
                puntaje: puntaje,
                totalPreguntas: totalPreguntas,
                porcentaje: porcentaje
            });
        }
    });
    
    // Generar datos para otros usuarios (simulación grupal)
    for (let i = 1; i <= 50; i++) {
        const usuarioId = `user${i.toString().padStart(3, '0')}`;
        
        temas.forEach(tema => {
            // Cada usuario tiene entre 0 y 3 evaluaciones por tema
            const numEvaluaciones = Math.floor(Math.random() * 4);
            
            for (let j = 0; j < numEvaluaciones; j++) {
                const puntaje = Math.floor(Math.random() * 4) + 1; // 1-4
                const totalPreguntas = 3;
                const porcentaje = (puntaje / totalPreguntas) * 100;
                
                resultados.push({
                    usuarioId: usuarioId,
                    temaId: tema.id,
                    fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    respuestas: [],
                    puntaje: puntaje,
                    totalPreguntas: totalPreguntas,
                    porcentaje: porcentaje
                });
            }
        });
    }
    
    localStorage.setItem('resultadosEvaluaciones', JSON.stringify(resultados));
}
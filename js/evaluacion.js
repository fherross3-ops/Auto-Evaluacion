// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const temaId = urlParams.get('tema');

// Elementos DOM
const temaNombre = document.getElementById('temaNombre');
const usuarioActual = document.getElementById('usuarioActual');
const questionsContainer = document.getElementById('questionsContainer');
const evaluationForm = document.getElementById('evaluationForm');

// Preguntas por tema (en una implementación real, esto vendría de una base de datos)
const preguntasPorTema = {
    1: [
        {
            id: 1,
            texto: "¿Qué elemento HTML5 se utiliza para representar contenido independiente como un artículo?",
            opciones: [
                { valor: 1, texto: "<article>" },
                { valor: 2, texto: "<section>" },
                { valor: 3, texto: "<div>" },
                { valor: 4, texto: "<content>" }
            ],
            respuestaCorrecta: 1
        },
        {
            id: 2,
            texto: "¿Cuál atributo se utiliza para hacer que un campo de formulario sea obligatorio?",
            opciones: [
                { valor: 1, texto: "mandatory" },
                { valor: 2, texto: "validate" },
                { valor: 3, texto: "required" },
                { valor: 4, texto: "necessary" }
            ],
            respuestaCorrecta: 3
        },
        {
            id: 3,
            texto: "¿Qué elemento HTML5 se utiliza para incrustar contenido multimedia?",
            opciones: [
                { valor: 1, texto: "<media>" },
                { valor: 2, texto: "<embed>" },
                { valor: 3, texto: "<object>" },
                { valor: 4, texto: "<video> o <audio>" }
            ],
            respuestaCorrecta: 4
        }
    ],
    // ... preguntas para los otros 9 temas
};

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

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    if (!usuarioLogueado) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!temaId) {
        alert('No se ha especificado un tema para evaluar');
        window.location.href = 'index.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogueado);
    const tema = temas.find(t => t.id == temaId);
    
    if (!tema) {
        alert('Tema no válido');
        window.location.href = 'index.html';
        return;
    }
    
    usuarioActual.textContent = `Usuario: ${usuario.nombre}`;
    temaNombre.textContent = `Tema: ${tema.nombre} - ${tema.descripcion}`;
    
    cargarPreguntas(temaId);
});

// Cargar preguntas del tema
function cargarPreguntas(temaId) {
    const preguntas = preguntasPorTema[temaId] || [];
    
    if (preguntas.length === 0) {
        questionsContainer.innerHTML = '<p>No hay preguntas disponibles para este tema.</p>';
        return;
    }
    
    questionsContainer.innerHTML = '';
    
    preguntas.forEach((pregunta, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        
        let opcionesHTML = '';
        pregunta.opciones.forEach(opcion => {
            opcionesHTML += `
                <div class="option">
                    <input type="radio" id="p${pregunta.id}_o${opcion.valor}" name="pregunta_${pregunta.id}" value="${opcion.valor}" required>
                    <label for="p${pregunta.id}_o${opcion.valor}">${opcion.texto}</label>
                </div>
            `;
        });
        
        questionElement.innerHTML = `
            <h3>Pregunta ${index + 1}</h3>
            <p>${pregunta.texto}</p>
            <div class="options">
                ${opcionesHTML}
            </div>
        `;
        
        questionsContainer.appendChild(questionElement);
    });
}

// Manejar envío de evaluación
evaluationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    const preguntas = preguntasPorTema[temaId] || [];
    
    let respuestas = [];
    let puntaje = 0;
    
    preguntas.forEach(pregunta => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta_${pregunta.id}"]:checked`);
        
        if (respuestaSeleccionada) {
            const esCorrecta = parseInt(respuestaSeleccionada.value) === pregunta.respuestaCorrecta;
            respuestas.push({
                preguntaId: pregunta.id,
                respuesta: parseInt(respuestaSeleccionada.value),
                correcta: esCorrecta
            });
            
            if (esCorrecta) {
                puntaje++;
            }
        }
    });
    
    const resultado = {
        usuarioId: usuarioLogueado.id,
        temaId: parseInt(temaId),
        fecha: new Date().toISOString(),
        respuestas: respuestas,
        puntaje: puntaje,
        totalPreguntas: preguntas.length,
        porcentaje: (puntaje / preguntas.length) * 100
    };
    
    // Guardar resultado (en una implementación real, esto se enviaría a un servidor)
    guardarResultado(resultado);
    
    alert(`Evaluación completada. Tu puntaje: ${puntaje}/${preguntas.length} (${resultado.porcentaje.toFixed(2)}%)`);
    window.location.href = 'dashboard.html';
});

// Guardar resultado (simulación)
function guardarResultado(resultado) {
    // En una implementación real, esto enviaría los datos a un servidor
    // Por ahora, lo guardamos en localStorage para simular
    let resultados = JSON.parse(localStorage.getItem('resultadosEvaluaciones')) || [];
    resultados.push(resultado);
    localStorage.setItem('resultadosEvaluaciones', JSON.stringify(resultados));
    
    console.log('Resultado guardado:', resultado);
}
// Datos de usuarios (simulando base de datos)
const usuarios = [
    { id: 'user001', nombre: 'Ana García', password: 'pass001' },
    { id: 'user002', nombre: 'Carlos López', password: 'pass002' },
    { id: 'user003', nombre: 'María Rodríguez', password: 'pass003' },
    // ... hasta 50 usuarios
];

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

// Elementos DOM
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const userNameSpan = document.getElementById('userName');
const topicsGrid = document.getElementById('topicsGrid');
const logoutBtn = document.getElementById('logoutBtn');

// Verificar si hay un usuario logueado
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioLogueado) {
        mostrarContenidoPrincipal(JSON.parse(usuarioLogueado));
    } else {
        loginSection.classList.remove('hidden');
        mainContent.classList.add('hidden');
    }
});

// Manejar login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    
    const usuario = usuarios.find(u => u.id === userId && u.password === password);
    
    if (usuario) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        mostrarContenidoPrincipal(usuario);
    } else {
        alert('ID de usuario o contraseña incorrectos');
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');
    loginSection.classList.remove('hidden');
    mainContent.classList.add('hidden');
    loginForm.reset();
});

// Mostrar contenido principal
function mostrarContenidoPrincipal(usuario) {
    loginSection.classList.add('hidden');
    mainContent.classList.remove('hidden');
    userNameSpan.textContent = usuario.nombre;
    
    cargarTemas();
}

// Cargar temas en la grid
function cargarTemas() {
    topicsGrid.innerHTML = '';
    
    temas.forEach(tema => {
        const temaCard = document.createElement('div');
        temaCard.className = 'topic-card';
        
        // Obtener progreso del usuario (simulado)
        const progreso = Math.floor(Math.random() * 101); // En una implementación real, esto vendría de la base de datos
        
        temaCard.innerHTML = `
            <h4>${tema.nombre}</h4>
            <p>${tema.descripcion}</p>
            <div class="progress-bar">
                <div class="progress" style="width: ${progreso}%"></div>
            </div>
            <p>Progreso: ${progreso}%</p>
            <a href="evaluacion.html?tema=${tema.id}" class="btn">Realizar Evaluación</a>
        `;
        
        topicsGrid.appendChild(temaCard);
    });
}
// Sistema de autenticación con localStorage
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.initializeDefaultUsers();
    }

    initializeDefaultUsers() {
        // Crear algunos usuarios de ejemplo si no existen
        if (this.users.length === 0) {
            const defaultUsers = [
                {
                    id: 'admin_001',
                    nombre: 'Administrador',
                    email: 'admin@eval.com',
                    password: 'admin123',
                    userId: 'ADMIN001',
                    role: 'admin',
                    fechaRegistro: new Date().toISOString()
                },
                {
                    id: 'user_001',
                    nombre: 'Ana García',
                    email: 'ana@eval.com',
                    password: 'ana123',
                    userId: 'USER001',
                    role: 'user',
                    fechaRegistro: new Date().toISOString()
                }
            ];
            
            this.users = defaultUsers;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    register(userData) {
        // Verificar si el usuario ya existe
        if (this.users.find(u => u.email === userData.email)) {
            throw new Error('El usuario ya existe');
        }

        if (this.users.find(u => u.userId === userData.userId)) {
            throw new Error('El ID de usuario ya está en uso');
        }

        const user = {
            id: this.generateId(),
            role: 'user',
            ...userData,
            fechaRegistro: new Date().toISOString()
        };

        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        return user;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Credenciales incorrectas');
        }
        
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
        return this.currentUser;
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getAllUsers() {
        return this.users;
    }
}

const authSystem = new AuthSystem();

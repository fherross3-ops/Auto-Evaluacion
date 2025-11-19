// Sistema de respaldo y restauración
class BackupSystem {
    constructor() {
        this.authSystem = authSystem;
        this.database = database;
    }

    // Exportar todos los datos
    exportData() {
        const data = {
            users: this.authSystem.getAllUsers(),
            evaluations: this.database.getEvaluations(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        this.downloadJSON(data, `backup-autoevaluacion-${new Date().toISOString().split('T')[0]}.json`);
    }

    // Importar datos
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validar datos
                    if (!data.users || !data.evaluations) {
                        throw new Error('Formato de archivo inválido');
                    }

                    // Actualizar datos
                    localStorage.setItem('users', JSON.stringify(data.users));
                    localStorage.setItem('evaluaciones', JSON.stringify(data.evaluations));
                    
                    // Recargar sistemas
                    authSystem = new AuthSystem();
                    database = new Database();
                    
                    resolve('Datos importados exitosamente');
                } catch (error) {
                    reject('Error importando datos: ' + error.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // Descargar archivo JSON
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Generar reporte PDF (simple)
    generateReport() {
        const user = this.authSystem.getCurrentUser();
        const stats = this.database.getStats(user.id);
        
        let reportContent = `
            REPORTE DE AUTOEVALUACIÓN
            Fecha: ${new Date().toLocaleDateString()}
            Usuario: ${user.nombre}
            Total evaluaciones: ${stats.total}
            Promedio general: ${stats.promedio.toFixed(1)}%
            
            DETALLE POR TEMA:
            ${Object.values(stats.porTema).map(tema => 
                `${tema.temaNombre}: ${tema.promedio.toFixed(1)}% (Mejor: ${tema.mejorResultado.toFixed(1)}%)`
            ).join('\n            ')}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-${user.nombre}-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

const backupSystem = new BackupSystem();
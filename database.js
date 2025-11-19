// Sistema de base de datos con localStorage
class Database {
    constructor() {
        this.evaluaciones = JSON.parse(localStorage.getItem('evaluaciones')) || [];
    }

    // Guardar evaluación
    async saveEvaluation(resultado) {
        const evaluacion = {
            id: this.generateId(),
            ...resultado,
            fecha: new Date().toISOString()
        };

        this.evaluaciones.push(evaluacion);
        localStorage.setItem('evaluaciones', JSON.stringify(this.evaluaciones));
        
        return evaluacion;
    }

    // Obtener evaluaciones
    getEvaluations(userId = null) {
        if (userId) {
            return this.evaluaciones.filter(e => e.usuarioId === userId);
        }
        return this.evaluaciones;
    }

    // Obtener evaluaciones por tema
    getEvaluationsByTopic(temaId, userId = null) {
        let evaluaciones = this.evaluaciones.filter(e => e.temaId === temaId);
        if (userId) {
            evaluaciones = evaluaciones.filter(e => e.usuarioId === userId);
        }
        return evaluaciones;
    }

    // Verificar límite de evaluaciones
    canEvaluate(temaId, userId) {
        const userEvaluations = this.getEvaluationsByTopic(temaId, userId);
        return userEvaluations.length < 3;
    }

    // Obtener estadísticas
    getStats(userId = null) {
        const evaluaciones = this.getEvaluations(userId);
        
        if (evaluaciones.length === 0) {
            return { total: 0, promedio: 0, porTema: {} };
        }

        const porTema = {};
        evaluaciones.forEach(eval => {
            if (!porTema[eval.temaId]) {
                porTema[eval.temaId] = {
                    temaId: eval.temaId,
                    temaNombre: eval.temaNombre,
                    evaluaciones: [],
                    promedio: 0,
                    mejorResultado: 0
                };
            }
            porTema[eval.temaId].evaluaciones.push(eval);
        });

        // Calcular promedios y mejores resultados
        Object.values(porTema).forEach(tema => {
            const porcentajes = tema.evaluaciones.map(e => e.porcentaje);
            tema.promedio = porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length;
            tema.mejorResultado = Math.max(...porcentajes);
        });

        const totalPorcentaje = evaluaciones.reduce((sum, eval) => sum + eval.porcentaje, 0) / evaluaciones.length;

        return {
            total: evaluaciones.length,
            promedio: totalPorcentaje,
            porTema: porTema
        };
    }

    generateId() {
        return 'eval_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Limpiar datos (solo admin)
    clearData() {
        this.evaluaciones = [];
        localStorage.setItem('evaluaciones', JSON.stringify(this.evaluaciones));
    }

    // Importar datos
    importData(data) {
        if (data.evaluaciones) {
            this.evaluaciones = data.evaluaciones;
            localStorage.setItem('evaluaciones', JSON.stringify(this.evaluaciones));
        }
    }
}

const database = new Database();
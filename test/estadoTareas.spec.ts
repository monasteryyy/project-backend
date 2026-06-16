import { describe, test, expect, beforeEach } from '@jest/globals';
import { EstadoTareasService, Tarea, historialEstados } from '../src/app.StateHomeworks';

describe('Pruebas Unitarias - Gestión de Estados (Daniel)', () => {
    let service: EstadoTareasService;
    let tareaMock: Tarea;

beforeEach(() => {
    service = new EstadoTareasService();
    
    // Forzar el vaciado del array original sin cambiar su referencia
    while(historialEstados.length > 0) {
        historialEstados.pop();
    }
    
    // Usamos una copia limpia para evitar que un test ensucie al otro
    tareaMock = { 
        id: 'task-123', 
        titulo: 'Hacer el testing', 
        estado: 'Creada' 
    };
});

  // TEST FUNCIONALIDAD 1
    describe('Funcionalidad 1: Actualizar Estado', () => {
    test('Debe cambiar el estado exitosamente y registrar en el historial', () => {
        const resultado = service.actualizarEstado(tareaMock, 'En Progreso');
        expect(resultado.estado).toBe('En Progreso');
        expect(historialEstados.length).toBe(1);
    }); 
    });

  // TEST FUNCIONALIDAD 2
    describe('Funcionalidad 2: Validar Transiciones (Casos Límite)', () => {
    test('⚠️ CASO LÍMITE: Debe lanzar error si se intenta cambiar una tarea Finalizada', () => {
        tareaMock.estado = 'Finalizada';
        expect(() => {
        service.actualizarEstado(tareaMock, 'En Progreso');
        }).toThrow("No se puede modificar una tarea que ya está Finalizada");
    });

    test('⚠️ CASO LÍMITE: Debe impedir salto inválido de Creada a Finalizada', () => {
        expect(() => {
        service.actualizarEstado(tareaMock, 'Finalizada');
        }).toThrow("No se puede saltar de Creada directamente a Finalizada");
    });
    });

  // TEST FUNCIONALIDAD 3
    describe('Funcionalidad 3: Obtener Historial', () => {
    test('⚠️ CASO LÍMITE: Debe retornar un arreglo vacío si la tarea no tiene historial', () => {
        const historial = service.obtenerHistorialPorTarea('id-inexistente');
        expect(historial).toEqual([]);
    });
    });
});
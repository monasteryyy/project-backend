export interface Tarea {
    id: string;
    titulo: string;
    estado: 'Creada' | 'En Progreso' | 'Finalizada' | 'Cancelada';
}

export interface RegistroHistorial {
    tareaId: string;
    estadoAnterior: string;
    estadoNuevo: string;
    fecha: Date;
}

export let historialEstados: RegistroHistorial[] = [];

export class EstadoTareasService {

    actualizarEstado(tarea: Tarea, nuevoEstado: Tarea['estado']): Tarea {
        if (!nuevoEstado) {
            throw new Error("El nuevo estado no es válido");
        }

        this.validarTransicion(tarea.estado, nuevoEstado);

        const estadoAnterior = tarea.estado;

        tarea.estado = nuevoEstado;
        historialEstados.push({
            tareaId: tarea.id,
            estadoAnterior,
            estadoNuevo: nuevoEstado,
            fecha: new Date()
        });

        return tarea;
    }

    validarTransicion(actual: Tarea['estado'], nuevo: Tarea['estado']): boolean {
        if (actual === 'Finalizada') {
            throw new Error("No se puede modificar una tarea que ya está Finalizada");
        }
        if (actual === 'Creada' && nuevo === 'Finalizada') {
            throw new Error("No se puede saltar de Creada directamente a Finalizada");
        }
        if (actual === 'Cancelada') {
            throw new Error("No se puede modificar una tarea que ya está Cancelada");
        }
        return true;
    }

    obtenerHistorialPorTarea(tareaId: string): RegistroHistorial[] {
        return historialEstados.filter(h => h.tareaId === tareaId);
    }
}
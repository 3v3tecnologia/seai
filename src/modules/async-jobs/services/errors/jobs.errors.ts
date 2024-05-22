export namespace BackgroundJobsErrors {
    export class ServiceNotAvailable extends Error {
        constructor() {
            super("Falha ao se comunicar com serviço de notificações")
            this.name = "ServiceNotAvailable"
        }
    }
}
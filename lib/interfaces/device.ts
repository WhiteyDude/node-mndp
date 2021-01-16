export interface Device {
    ipAddress: string;
    macAddress: string;
    version: string;
    identity: string;
    platform: string;
    uptime: number;
    softwareId: string;
    board: string;
    unpack: number;
    interfaceName: string;
}
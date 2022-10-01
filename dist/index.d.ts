/// <reference types="node" />
import * as dgram from "dgram";
import * as events from "events";
import { Options } from './interfaces/options';
export declare class NodeMndp extends events.EventEmitter {
    server: any;
    default: Options;
    port: undefined | number;
    host: undefined | string;
    started: undefined | boolean;
    version: dgram.SocketType;
    constructor(options: Options);
    /**
     * Start the server
     */
    start(): void;
    /**
     * Stop the server
     */
    stop(): void;
    /**
     * Initalize Listeners
     */
    private registerListeners;
    /**
     * Instigate responses from neighbors.
     *
     * According to Wireshark on Windows, pressing the Refresh button on Mikrotik's
     * WinBox tool causes it to send three packets:
     * 1. to 255.255.255.255
     * 2. to your subnet's broadcast address, e.g. 192.168.1.255
     * 3. to 239.255.255.255
     * The first one works but it causes the server to pick up the packet.
     * The second one I am not sure how to correctly acquire the IP for, so I skipped.
     * The third seems to work best because it works without causing our server to react.
     */
    refresh(portOverride?: null): void;
}

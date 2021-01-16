import * as dgram from "dgram";
import * as events from "events";
import { EventEmitter } from "events";

import { Options } from './interfaces/options';

import { Discovery } from './Discovery';

export class NodeMndp extends events.EventEmitter {
    server: any;
    default: Options = {
        port: 5678,
        host: '0.0.0.0',
        version: 'udp4'
    };

    port: undefined | number;
    host: undefined | string;
    started: undefined | boolean;
    version: dgram.SocketType;

    constructor(options: Options) {
        super();

        this.version = options.version || this.default.version;
        this.server = dgram.createSocket(this.version);
        
        this.port = options.port || this.default.port;
        this.host = options.host || this.default.host;

        this.started = false;
        
        this.registerListeners();
        
    }

    /**
     * Start the server
     */
    start(): void
    {
        if (this.server) {
            this.started = true;
            this.server.bind(this.port, this.host)
        }
    }

    /**
     * Stop the server
     */
    stop(): void
    {
        if (this.server && this.started) {
            this.server.close();
            this.started = false;
        }
    }

    /**
     * Initalize Listeners
     */
    private registerListeners(): void
    {
        this.server.on('message', (msg: any, rinfo: any) => {
            let device = new Discovery(msg, rinfo);
            device.output((device) => {
                this.emit('deviceFound', device);
            })
        })

        this.server.on('error', (msg: any, rinfo: any) => {
            this.emit('error', msg);
            this.stop();
        })

        this.server.on('listening', (msg: any, rinfo: any) => {
            this.emit('started',`Listening on ${this.server.address().address}:${this.server.address().port}`);
            this.server.setBroadcast(true);
        })
    }

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
    refresh(portOverride=null): void
    {
        if (!this.started)
            return;
        
        let port = portOverride || this.port;
        let buf = Buffer.alloc(4);
        buf.fill(0);
        this.server.send(buf, 0, 4, port, '239.255.255.255');
    }
}
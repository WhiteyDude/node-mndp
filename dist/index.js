"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dgram = require("dgram");
const events = require("events");
const Discovery_1 = require("./Discovery");
class NodeMndp extends events.EventEmitter {
    constructor(options) {
        super();
        this.default = {
            port: 5678,
            host: '0.0.0.0',
            version: 'udp4'
        };
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
    start() {
        if (this.server) {
            this.started = true;
            this.server.bind(this.port, this.host);
        }
    }
    /**
     * Stop the server
     */
    stop() {
        if (this.server && this.started) {
            this.server.close();
            this.started = false;
        }
    }
    /**
     * Initalize Listeners
     */
    registerListeners() {
        this.server.on('message', (msg, rinfo) => {
            let device = new Discovery_1.Discovery(msg, rinfo);
            device.output((device) => {
                this.emit('deviceFound', device);
            });
        });
        this.server.on('error', (msg, rinfo) => {
            this.emit('error', msg);
            this.stop();
        });
        this.server.on('listening', (msg, rinfo) => {
            this.emit('started', `Listening on ${this.server.address().address}:${this.server.address().port}`);
            this.server.setBroadcast(true);
        });
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
    refresh(portOverride = null) {
        if (!this.started)
            return;
        let port = portOverride || this.port;
        let buf = Buffer.alloc(4);
        buf.fill(0);
        this.server.send(buf, 0, 4, port, '239.255.255.255');
    }
}
exports.NodeMndp = NodeMndp;

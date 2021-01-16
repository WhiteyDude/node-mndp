# Node MNDP
`Mikrotik Network Discovery Protocol`

This is an implementation written in Node

NOTE: The library does **not** automatically send a "refresh" packet to cause neighbors to announce themselves, but the function is implemented and available in the API as `refresh()`.

### Usage Example
```
var mndp = require('node-mndp').NodeMndp;
var discovery = new mndp({
    port: 5678
});

discovery.on('deviceFound', (device) => {
    // retrieve found device here
})

discovery.start();
```

Ipv6 Example
```
var mndp = require('node-mndp').NodeMndp;
var discovery = new mndp({
    port: 5678,
    host: "::",
    version: "udp6"
});

discovery.on('deviceFound', (device) => {
    // retrieve found device here
})

discovery.start();
```
### API
```
var mndp = require('node-mndp').NodeMndp;
var discovery = new mndp({
    port: 5678
});
```

#### discovery.constructor({options: Options})
```
options {
    `host` : default = 0.0.0.0
    `port` : default = 5678
    `version` : default = udp4
}
```

#### discovery.start() -> void

#### discovery.stop() -> void

#### discovery.refresh() -> void

#### Event: 'deviceFound'
```

Output:
{
    "ipAddress":"192.168.88.1",
    "macAddress":"aabbccddeeff",
    "identity":"Mikrotik",
    "version":"6.41.2 (stable)"
    "platform":"MikroTik",
    "uptime":12190,
    "softwareId":"8C0S-DDXE",
    "board":"RB2011UiAS-2HnD",
    "unpack":0,
    "interfaceName":"LAN_Bridge/ether2"
}

```
#### Event: 'error' -> string

#### Event: 'started' -> string

---
Pull requests are welcome!
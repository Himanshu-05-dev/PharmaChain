// server/scripts/lan-bridge.js
// Bridges external LAN connections (e.g. 192.168.1.9) to Kubernetes localhost port-forwards (127.0.0.1)

import net from 'net';
import os from 'os';

const PORTS = [3001, 3002, 3003, 3005, 4000];

function getLanIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

const lanIps = getLanIps();
console.log(`[LAN Bridge] Detected LAN IP(s): ${lanIps.join(', ')}`);

PORTS.forEach((port) => {
  lanIps.forEach((ip) => {
    const server = net.createServer((clientSocket) => {
      const targetSocket = net.connect(port, '127.0.0.1', () => {
        clientSocket.pipe(targetSocket);
        targetSocket.pipe(clientSocket);
      });

      targetSocket.on('error', (err) => {
        // Suppress reset noise
        clientSocket.destroy();
      });

      clientSocket.on('error', (err) => {
        targetSocket.destroy();
      });
    });

    server.listen(port, ip, () => {
      console.log(`[LAN Bridge] Proxying http://${ip}:${port} → http://127.0.0.1:${port}`);
    });

    server.on('error', (err) => {
      if (err.code !== 'EADDRINUSE') {
        console.warn(`[LAN Bridge] Warning on ${ip}:${port} - ${err.message}`);
      }
    });
  });
});

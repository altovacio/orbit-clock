import { createServer } from 'vite';
import viteConfig from '../vite.config';

(async () => {
  const vite = await createServer({
    ...viteConfig,
    server: {
      port: 5000,
      host: '0.0.0.0',
      hmr: {
        host: '0.0.0.0',
        clientPort: 443,
      },
      // Allow all hosts
      cors: true,
      // Allow any hostname to access the dev server
      origin: '*',
      // Ensure all hosts are allowed (using correct type)
      allowedHosts: true
    }
  });

  await vite.listen();
  console.log('Vite dev server running at http://localhost:5000');
})();
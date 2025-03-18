import { createServer } from 'vite';
import viteConfig from '../vite.config';

(async () => {
  const vite = await createServer({
    ...viteConfig,
    server: {
      port: 5000,
      host: '0.0.0.0',
    }
  });

  await vite.listen();
  console.log('Vite dev server running at http://localhost:5000');
})();
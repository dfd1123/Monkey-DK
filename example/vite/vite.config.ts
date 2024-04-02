import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteSvgComponentPlugin } from 'monkey-d/modules'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSvgComponentPlugin({svgFileDir: 'src/assets/svgs', typescript: true})],
})

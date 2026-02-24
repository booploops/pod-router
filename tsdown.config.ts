import { defineConfig } from 'tsdown'
import packageJson from './package.json' with { type: 'json' }
export default defineConfig({
  platform: 'neutral',
  fromVite: true,
  dts: { vue: true },
  banner: `/**
 * pod-router v${packageJson.version}
 * (c) 2026-present, booploops and contributors
 * @license ISC
**/`
})

import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node"

const isProd = import.meta.env.PROD;
const isDev = import.meta.env.DEV;

// https://astro.build/config
let config = {
  output: "server"
}

if (isProd) {
  config.adapter = cloudflare()
} else {
  config.adapter = node({
    mode: 'standalone',
  })
}

export default defineConfig(config);
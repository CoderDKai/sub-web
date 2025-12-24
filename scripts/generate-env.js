#!/usr/bin/env node

/**
 * 生成 .env.production 文件的脚本
 * 从环境变量读取配置，未设置的变量将被跳过
 *
 * 用法：
 *   node scripts/generate-env.js
 *   或在 package.json 中定义 script：
 *   "generate-env": "node scripts/generate-env.js"
 */

const fs = require('fs');
const path = require('path');

// 需要处理的环境变量列表
const ENV_VARS = [
  'VUE_APP_PROJECT',
  'VUE_APP_BOT_LINK',
  'VUE_APP_BACKEND_RELEASE',
  'VUE_APP_SUBCONVERTER_REMOTE_CONFIG',
  'VUE_APP_SUBCONVERTER_DOC_ADVANCED',
  'VUE_APP_SUBCONVERTER_DEFAULT_BACKEND',
  'VUE_APP_DEFAULT_BACKEND_OPTION',
  'VUE_APP_MYURLS_API',
  'VUE_APP_CONFIG_UPLOAD_API',
  'VUE_APP_USE_STORAGE',
  'VUE_APP_CACHE_TTL',
  'VUE_APP_REMOTE_CONFIGS',
  'VUE_APP_DEFAULT_REMOTE_CONFIG',
  'VUE_APP_BACKEND_OPTIONS'
];

function generateEnvFile() {
  const lines = [];

  for (const key of ENV_VARS) {
    const value = process.env[key];
    if (value !== undefined && value !== '') {
      lines.push(`${key}=${value}`);
    }
  }

  const outputPath = path.resolve(__dirname, '..', '.env.production');
  const content = lines.join('\n');

  fs.writeFileSync(outputPath, content, 'utf8');

  console.log(`Generated ${outputPath}:`);
  if (content) {
    console.log(content);
  } else {
    console.log('(empty - no variables set)');
  }

  return lines.length;
}

// 执行
const count = generateEnvFile();
console.log(`\nTotal: ${count} variable(s) written.`);


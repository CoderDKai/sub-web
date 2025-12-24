// 后端配置选项
let backendConfigs = [
  { value: "http://127.0.0.1:25500/sub?" }
];

if (process.env.VUE_APP_BACKEND_CONFIG) {
  try {
    backendConfigs = JSON.parse(process.env.VUE_APP_BACKEND_CONFIG);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse VUE_APP_BACKEND_CONFIG", e);
  }
}

export const BACKEND_CONFIGS = backendConfigs;

/**
 * 尝试从环境变量中解析 JSON 配置，失败时返回默认值
 * @param {string} key - 环境变量名
 * @param {*} fallback - 解析失败时返回的默认值
 * @returns {*}
 */
export function parseJsonEnv(key, fallback) {
  const raw = process.env[key];

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    // 环境变量格式错误时回退到默认值，避免阻断应用
    return fallback;
  }
}

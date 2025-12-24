import { parseJsonEnv } from './env-utils';

const normalizeRemoteOption = (option) => {
  if (!option) {
    return null;
  }

  if (typeof option === 'string') {
    return { label: option, value: option };
  }

  if (typeof option === 'object') {
    const value = option.value || option.label;
    if (!value) {
      return null;
    }
    return {
      label: option.label || value,
      value
    };
  }

  return null;
};

const normalizeRemoteGroup = (group) => {
  if (!group) {
    return null;
  }

  const options = Array.isArray(group.options)
    ? group.options.map(normalizeRemoteOption).filter(Boolean)
    : [];

  if (!options.length) {
    return null;
  }

  return {
    label: group.label || group.name || 'Default',
    options
  };
};

const DEFAULT_REMOTE_CONFIGS = [
  {
    label: "universal",
    options: [
      {
        label: "No-Urltest",
        value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/no-urltest.ini"
      },
      {
        label: "Urltest",
        value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/universal/urltest.ini"
      }
    ]
  },
  {
    label: "customized",
    options: [
      { label: "Maying", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/maying.ini" },
      { label: "Ytoo", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ytoo.ini" },
      { label: "FlowerCloud", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/flowercloud.ini" },
      { label: "Nexitally", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/nexitally.ini" },
      { label: "SoCloud", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/socloud.ini" },
      { label: "ARK", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ark.ini" },
      { label: "ssrCloud", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/customized/ssrcloud.ini" }
    ]
  },
  {
    label: "Special",
    options: [
      { label: "NeteaseUnblock(仅规则，No-Urltest)", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/netease.ini" },
      { label: "Basic(仅GEOIP CN + Final)", value: "https://cdn.jsdelivr.net/gh/SleepyHeeead/subconverter-config@master/remote-config/special/basic.ini" }
    ]
  }
];

// 远程配置选项
const envRemoteConfigs = parseJsonEnv('VUE_APP_REMOTE_CONFIGS', DEFAULT_REMOTE_CONFIGS);
const normalizedEnvConfigs = Array.isArray(envRemoteConfigs)
  ? envRemoteConfigs.map(normalizeRemoteGroup).filter(Boolean)
  : DEFAULT_REMOTE_CONFIGS.map(normalizeRemoteGroup).filter(Boolean);

const fallbackConfigs = DEFAULT_REMOTE_CONFIGS.map(normalizeRemoteGroup).filter(Boolean);

export const REMOTE_CONFIGS = normalizedEnvConfigs.length ? normalizedEnvConfigs : fallbackConfigs;

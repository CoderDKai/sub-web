import { parseJsonEnv } from './env-utils';

const normalizeBackend = (backend) => {
  if (!backend) {
    return null;
  }

  if (typeof backend === 'string') {
    return { label: backend, value: backend };
  }

  if (typeof backend === 'object' && backend.value) {
    return {
      label: backend.label || backend.value,
      value: backend.value
    };
  }

  return null;
};

const baseBackend = process.env.VUE_APP_SUBCONVERTER_DEFAULT_BACKEND;
const defaultBackendWithPath = baseBackend
  ? `${baseBackend.replace(/\/$/, "")}/sub?`
  : null;

const DEFAULT_BACKEND_OPTIONS = [
  { value: "http://127.0.0.1:25500/sub?" },
  ...(defaultBackendWithPath ? [{ value: defaultBackendWithPath }] : [])
];

const envBackends = parseJsonEnv('VUE_APP_BACKEND_OPTIONS', DEFAULT_BACKEND_OPTIONS);
const normalizedBackends = Array.isArray(envBackends)
  ? envBackends.map(normalizeBackend).filter(Boolean)
  : DEFAULT_BACKEND_OPTIONS;

export const BACKEND_OPTIONS = normalizedBackends.length ? normalizedBackends : DEFAULT_BACKEND_OPTIONS;

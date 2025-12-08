const levels = ['debug', 'info', 'warn', 'error'];

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const payload = meta ? { ...meta } : undefined;
  return { timestamp, level, message, ...(payload && { meta: payload }) };
};

const log = (level) => (message, meta) => {
  const payload = formatMessage(level, message, meta);
  const serialized = JSON.stringify(payload);

  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
};

const logger = levels.reduce((acc, level) => {
  acc[level] = log(level);
  return acc;
}, {});

module.exports = logger;

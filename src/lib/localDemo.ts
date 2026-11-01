export const isLocalDemoAvailable = () =>
  import.meta.env.DEV &&
  ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

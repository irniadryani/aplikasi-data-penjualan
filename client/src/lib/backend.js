export function getBackendHost() {
  return (
    import.meta.env?.VITE_BACKEND_HOST?.replace(/\/$/, "") ||
    window.location.origin
  );
}

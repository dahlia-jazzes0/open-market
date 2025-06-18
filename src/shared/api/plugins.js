export function wenivApi(path) {
  return (builder) => {
    builder.url(import.meta.env.VITE_API_ENDPOINT + path);
  };
}

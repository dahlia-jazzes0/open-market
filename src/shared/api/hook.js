import { createEffect, createSignal } from "../element-helper/element-helper";

export function useApi(fetcher) {
  const [data, setData] = createSignal();
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  createEffect(() => {
    fetcher()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  });
  return {
    data,
    loading,
    error,
  };
}

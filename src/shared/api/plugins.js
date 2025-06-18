import { auth } from "../auth/auth";

export function authn() {
  return async (builder) => {
    const token = await auth.getAccessToken();
    if (token != null) builder.header("authorization", `Bearer ${token}`);
  };
}
export function wenivApi(path) {
  return (builder) => {
    builder.url(import.meta.env.VITE_API_ENDPOINT + path);
  };
}

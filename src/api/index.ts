import { Api } from "./Api";
import { API_BASE_URL } from "../config";

// Клиент API, сгенерированный из swagger. SecurityData — JWT; он ставится после входа (api.setSecurityData)
// и добавляется в заголовок Authorization у методов с secure: true
export const api = new Api<string>({
  // пустой адрес сгенерированный клиент заменил бы на localhost:8080 из swagger, поэтому "/" — тот же адрес, что у страницы
  baseURL: API_BASE_URL || "/",
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});

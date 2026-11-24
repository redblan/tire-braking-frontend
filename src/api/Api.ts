/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerAnglesRequest {
  angle_x?: number;
  angle_y?: number;
  token?: string;
}

export interface HandlerAuthResponse {
  access_token?: string;
}

export interface HandlerCredentialsRequest {
  password?: string;
  username?: string;
}

export interface HandlerLikeRequest {
  value?: number;
}

export interface HandlerPublishTireConditionRequest {
  description?: string;
  description_en?: string;
  mu_surface?: number;
  mu_tire?: number;
}

export interface RepositoryFeedResponse {
  angle_x?: number;
  angle_y?: number;
  description?: string;
  description_en?: string;
  id?: number;
  image_url?: string;
  is_liked?: number;
  is_owner?: number;
  model_url?: string;
  mu_surface?: number;
  mu_tire?: number;
  name?: string;
  position?: number;
}

export interface RepositoryTireConditionResponse {
  angle_x?: number;
  angle_y?: number;
  description?: string;
  description_en?: string;
  id?: number;
  image_url?: string;
  is_owner?: number;
  model_url?: string;
  mu_surface?: number;
  mu_tire?: number;
  name?: string;
}

export interface RepositoryTireConditionsPage {
  data?: RepositoryTireConditionResponse[];
  limit?: number;
  page?: number;
  total?: number;
}

export interface RepositoryUserResponse {
  id?: number;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title BrakePath API
 * @version 1.0
 * @baseUrl //localhost:8080
 * @contact
 *
 * Расчёт тормозного пути: услуги (состояния шин и покрытия) и авторизация по JWT.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthCreate
     * @summary Вход, выдача JWT
     * @request POST:/api/auth
     */
    authCreate: (body: HandlerCredentialsRequest, params: RequestParams = {}) =>
      this.request<HandlerAuthResponse, void>({
        path: `/api/auth`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name LogoutCreate
     * @summary Выход: токен попадает в blacklist до своего истечения
     * @request POST:/api/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description is_moderator всегда false; пароль хранится как bcrypt-хеш
     *
     * @tags auth
     * @name RegisterCreate
     * @summary Регистрация
     * @request POST:/api/register
     */
    registerCreate: (
      body: HandlerCredentialsRequest,
      params: RequestParams = {},
    ) =>
      this.request<RepositoryUserResponse, void>({
        path: `/api/register`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Пагинация: page (с 1) и limit (по умолчанию 10, максимум 100). total — число услуг, подходящих под фильтр. is_owner: 0 или 1 — создатель услуги совпадает с текущим пользователем (для гостя 0)
     *
     * @tags tire-conditions
     * @name TireConditionsList
     * @summary Список опубликованных услуг (страница)
     * @request GET:/api/tire-conditions
     */
    tireConditionsList: (
      query?: {
        /** Минимальный коэффициент сцепления шины (mu_tire) */
        grip?: number;
        /**
         * Номер страницы, с 1
         * @default 1
         */
        page?: number;
        /**
         * Размер страницы, максимум 100
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RepositoryTireConditionsPage, void>({
        path: `/api/tire-conditions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tire-conditions
     * @name TireConditionsCreate
     * @summary Создать услугу (черновик) с загрузкой изображения и 3D модели в Minio
     * @request POST:/api/tire-conditions
     * @secure
     */
    tireConditionsCreate: (
      data: {
        /** Название */
        name: string;
        /** Описание */
        description?: string;
        /** Коэффициент сцепления шины */
        mu_tire?: number;
        /** Коэффициент сцепления покрытия */
        mu_surface?: number;
        /**
         * Изображение
         * @format binary
         */
        image: File;
        /**
         * 3D модель (.glb)
         * @format binary
         */
        model: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<RepositoryTireConditionResponse, void>({
        path: `/api/tire-conditions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tire-conditions
     * @name TireConditionsDraftList
     * @summary Черновик услуги текущего пользователя
     * @request GET:/api/tire-conditions/draft
     * @secure
     */
    tireConditionsDraftList: (params: RequestParams = {}) =>
      this.request<RepositoryTireConditionResponse, void>({
        path: `/api/tire-conditions/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description При next=true запускается асинхронный сервис: через 5–10 секунд он присылает новые углы поворота 3D модели этой услуги (angle_x, angle_y), их видно повторным запросом по id. Лента формируется в Redis при первом обращении сессии: 100 случайных неповторяющихся опубликованных услуг с порядковыми номерами (position); гость — по куке feed_session, авторизованный — по user_id. Без id — первая услуга ленты; ?id=N — услуга N; ?id=N&next=true — следующая в ленте после N; после 100-й формируются новые 100. is_liked: 0 или 1 — стоит ли лайк текущего пользователя на услуге (для гостя 0). position — порядковый номер услуги в ленте сессии (0, если услуги нет в ленте).
     *
     * @tags tire-conditions
     * @name TireConditionsFeedList
     * @summary Одна услуга ленты
     * @request GET:/api/tire-conditions/feed
     */
    tireConditionsFeedList: (
      query?: {
        /** ID услуги; без параметра — первая услуга ленты */
        id?: number;
        /** true — вернуть следующую услугу ленты после id */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<RepositoryFeedResponse, void>({
        path: `/api/tire-conditions/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Своя услуга; модератор — любая
     *
     * @tags tire-conditions
     * @name TireConditionsDelete
     * @summary Удалить услугу (логически)
     * @request DELETE:/api/tire-conditions/{id}
     * @secure
     */
    tireConditionsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/tire-conditions/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Вызывается асинхронным сервисом. Вместо JWT — постоянный ключ token в теле запроса. Углы в градусах, от 0 до 360.
     *
     * @tags tire-conditions
     * @name TireConditionsAnglesUpdate
     * @summary Записать новые углы поворота 3D модели услуги (результат асинхронного сервиса)
     * @request PUT:/api/tire-conditions/{id}/angles
     */
    tireConditionsAnglesUpdate: (
      id: number,
      body: HandlerAnglesRequest,
      params: RequestParams = {},
    ) =>
      this.request<RepositoryTireConditionResponse, void>({
        path: `/api/tire-conditions/${id}/angles`,
        method: "PUT",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tire-conditions
     * @name TireConditionsLikeCreate
     * @summary Поставить или снять лайк
     * @request POST:/api/tire-conditions/{id}/like
     * @secure
     */
    tireConditionsLikeCreate: (
      id: number,
      body: HandlerLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/tire-conditions/${id}/like`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Своя услуга; модератор — любая
     *
     * @tags tire-conditions
     * @name TireConditionsPublishUpdate
     * @summary Опубликовать черновик услуги
     * @request PUT:/api/tire-conditions/{id}/publish
     * @secure
     */
    tireConditionsPublishUpdate: (
      id: number,
      body: HandlerPublishTireConditionRequest,
      params: RequestParams = {},
    ) =>
      this.request<RepositoryTireConditionResponse, void>({
        path: `/api/tire-conditions/${id}/publish`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}

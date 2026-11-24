import { RepositoryFeedResponse, RepositoryTireConditionResponse } from "../api/Api";

// Услуга — условия торможения
export interface TireCondition {
    id: number
    name: string
    description: string
    description_en: string // краткое описание на английском — по нему ищутся похожие карточки
    image_url: string
    model_url: string
    mu_tire: number
    mu_surface: number
    angle_x: number
    angle_y: number
    is_owner: number
}

// Услуга в ленте: is_liked — лайк текущего пользователя (0/1), position — порядковый номер в ленте сессии
export interface FeedItem extends TireCondition {
    is_liked: number
    position: number
}

// В сгенерированных типах все поля необязательные — приводим ответ бэкенда к типам приложения
export const toTireCondition = (dto: RepositoryTireConditionResponse): TireCondition => ({
    id: dto.id ?? 0,
    name: dto.name ?? "",
    description: dto.description ?? "",
    description_en: dto.description_en ?? "",
    image_url: dto.image_url ?? "",
    model_url: dto.model_url ?? "",
    mu_tire: dto.mu_tire ?? 0,
    mu_surface: dto.mu_surface ?? 0,
    angle_x: dto.angle_x ?? 0,
    angle_y: dto.angle_y ?? 0,
    is_owner: dto.is_owner ?? 0,
})

export const toFeedItem = (dto: RepositoryFeedResponse): FeedItem => ({
    ...toTireCondition(dto),
    is_liked: dto.is_liked ?? 0,
    position: dto.position ?? 0,
})

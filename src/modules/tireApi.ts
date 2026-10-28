export interface TireCondition {
    id: number
    name: string
    description: string
    image_url: string
    video_url: string
    mu_tire: number
    mu_surface: number
}

export interface TireConditionsResult {
    resultCount: number
    results: TireCondition[]
}

export class UpdateProductDto {
  id: number
  name?: string
  description?: string
  size?: string
  color?: string
  price?: string
  category?: string
  genre?: string
  material?: string
  care_instruc?: string
  model_num?: number
  serie?: number
  on_stock?: boolean
  images?: image[]
  shipment_details?: string
  keywords?: keyword[]
  opinions?: string[]
  status?: string
}

class image {
  id: number
  path: string
}

class keyword {
  id: number
  keyword: string
}
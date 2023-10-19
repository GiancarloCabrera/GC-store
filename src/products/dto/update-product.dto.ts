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
  images?: string[]
  shipment_details?: string
  keywords?: string[]
  opinions?: string[]
  status?: string
}

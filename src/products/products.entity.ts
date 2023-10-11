import Keyword from "src/keywords/keywords.entity"
import Opinion from "src/opinions/opinions.entity"
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import ProductImages from "./productsImages.entity"

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  size: string

  @Column()
  color: string

  @Column()
  price: string

  @Column()
  category: string

  @Column()
  genre: string

  @Column()
  material: string

  @Column()
  care_instruc: string

  @Column()
  model_num: number

  @Column()
  serie: number

  @Column()
  on_stock: boolean

  @OneToMany(type => ProductImages, productImages => productImages.product)
  images: ProductImages[]

  @Column()
  shipment_details: string

  @ManyToMany(type => Keyword)
  @JoinTable()
  keywords: Keyword

  @OneToMany(type => Opinion, opinion => opinion.product)
  opinions: Opinion[]

  // Price - Notifications
  // -------------------
  // -------------------

  @Column()
  status: string

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}
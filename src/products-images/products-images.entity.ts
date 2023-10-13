import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import Product from "../products/products.entity"

@Entity()
export default class ProductImages {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @ManyToOne(type => Product, product => product.images)
  product: Product

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}
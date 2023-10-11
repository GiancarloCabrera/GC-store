import Product from "src/products/products.entity";
import User from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Opinion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @ManyToOne(type => Product, product => product.opinions)
  product: Product

  @OneToOne(type => User)
  @JoinColumn()
  user: User

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}
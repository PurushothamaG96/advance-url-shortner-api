import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Url } from "./shortURL";

@Entity("analytics")
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Url)
  shortUrl: Url;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @Column()
  osName: string;

  @Column()
  deviceName: string;

  @CreateDateColumn()
  accessedAt: Date;
}

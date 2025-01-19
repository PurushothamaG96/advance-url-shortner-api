import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Url } from "./shortURL.entity";
import { User } from "./users.entity";

@Entity("analytics")
export class Analytics {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  sortUrlId: string;

  @Column({ type: "uuid" })
  accessUserId: string;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @Column()
  osName: string;

  @Column()
  deviceName: string;

  @Column()
  geoLocator: string;

  @CreateDateColumn()
  accessedAt: Date;

  @ManyToOne(() => Url, (url) => url.analytics)
  @JoinColumn({ name: "sortUrlId", referencedColumnName: "id" })
  shortUrl: Url;

  @ManyToOne(() => User, (user) => user.analytics)
  @JoinColumn({ name: "accessUserId", referencedColumnName: "id" })
  user: Url;
}

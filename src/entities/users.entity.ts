import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Url } from "./shortURL.entity";
import { Analytics } from "./analytics.entity";
import { UniqueOS } from "./uniqueOs.entity";
import { UniqueDevices } from "./uniqueDevices.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  googleId: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: "text", nullable: true, default: null })
  profileUrl: string | null;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @OneToMany(() => Analytics, (analytics) => analytics.user)
  analytics: Analytics[];

  @OneToMany(() => UniqueOS, (uniqueOs) => uniqueOs.user)
  os: UniqueOS[];

  @OneToMany(() => UniqueDevices, (uniqueDevice) => uniqueDevice.user)
  device: UniqueDevices[];
}

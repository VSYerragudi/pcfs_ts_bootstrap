import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@pcfs-demo/shared';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column('simple-array', { default: 'user' })
  roles!: Role[];

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Flag to track if password needs hashing
  private tempPassword?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.tempPassword) {
      this.password = await bcrypt.hash(this.tempPassword, 10);
      this.tempPassword = undefined;
    }
  }

  setPassword(password: string) {
    this.tempPassword = password;
    this.password = password; // Will be hashed in BeforeUpdate
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toSafeObject(): Omit<User, 'password' | 'tempPassword' | 'hashPasswordBeforeInsert' | 'hashPasswordBeforeUpdate' | 'setPassword' | 'validatePassword' | 'toSafeObject'> {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      roles: this.roles,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

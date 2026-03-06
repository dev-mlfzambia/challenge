import { Province } from 'src/modules/provinces/entities/province.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Relation,
} from 'typeorm';

@Entity('towns')
export class Town {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ManyToOne(() => Province, (province) => province.towns)
  province: Relation<Province>;
}

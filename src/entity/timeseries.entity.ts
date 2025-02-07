import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Countries } from './country.entity';

@Entity('timeseries')
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  date: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  confirmed: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  deaths: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  recovered: number;

  @ManyToOne(() => Countries, (country) => country.timeseries)
  @JoinColumn({ name: 'countryId', referencedColumnName: 'id' }) 
  country: Countries;
}

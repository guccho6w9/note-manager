import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      url: process.env.DATABASE_URL,
      username: 'postgres',
      password: 'agus2k15',
      database: 'notas_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Ruta a las entidades
      synchronize: true, // Solo para desarrollo
    }),
    NotesModule,
  ],
})
export class AppModule {}
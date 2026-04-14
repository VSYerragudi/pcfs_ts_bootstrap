import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MONGO_HOST', 'localhost');
        const port = configService.get<number>('MONGO_PORT', 27017);
        const user = configService.get<string>('MONGO_USER', 'admin');
        const password = configService.get<string>('MONGO_PASSWORD', 'password');
        const database = configService.get<string>('MONGO_DB', 'app_db');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}

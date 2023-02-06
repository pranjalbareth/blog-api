import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UsersSchema }])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

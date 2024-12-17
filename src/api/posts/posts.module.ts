import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AuthModule, 
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [PostController],
  providers: [PostService, FirebaseService],
})
export class PostModule {}

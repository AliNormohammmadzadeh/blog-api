import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    try {
      return await this.postRepository.find();
    } catch (error) {
      throw new NotFoundException('Posts not found');
    }
  }

  async findOne(id: number): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return post;
    } catch (error) {
      throw new NotFoundException('Post not found');
    }
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    // Update post fields
    post.title = updatePostDto.title || post.title;
    post.content = updatePostDto.content || post.content;
    post.imageUrl = updatePostDto.imageUrl || post.imageUrl;

    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}

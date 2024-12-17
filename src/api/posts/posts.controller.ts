import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    Req,
    Res,
  } from '@nestjs/common';
  import { CreatePostDto } from './dto/create-post.dto';
  import { AuthGuard } from '../../common/guards/auth.guard';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { Response } from 'express';
import { User } from 'src/common/decorator/user.decorator';
import { PostService } from './posts.service';
  
  const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const name = Date.now() + extname(file.originalname);
      callback(null, name); 
    },
  });
  
  @ApiTags('Posts')
  @Controller('posts')
  @UseGuards(AuthGuard) 
  export class PostController {
    constructor(private readonly postService: PostService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all blog posts' })
    async findAll() {
      try {
        return await this.postService.findAll();
      } catch (error) {
        throw new BadRequestException('Error retrieving posts');
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific blog post by ID' })
    async findOne(@Param('id') id: number) {
      try {
        const post = await this.postService.findOne(id);
        if (!post) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
      } catch (error) {
        throw new BadRequestException(`Error retrieving post: ${error.message}`);
      }
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a new blog post' })
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image', { storage }))
    async create(
      @Body() createPostDto: CreatePostDto,
      @UploadedFile() file: Express.Multer.File,
      @User() user,
    ) {
      try {
        if (!user) {
          throw new UnauthorizedException('User not authenticated');
        }
  
        createPostDto.userId = user.uid; 
  
        if (file) {
          createPostDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`; 
        }
  
        return await this.postService.create(createPostDto);
      } catch (error) {
        throw new BadRequestException(`Error creating post: ${error.message}`);
      }
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a blog post by ID' })
    @ApiBearerAuth()
    async update(
      @Param('id') id: number,
      @Body() updatePostDto: CreatePostDto,
      @User() user,
    ) {
      try {
        const post = await this.postService.findOne(id);
        if (!post) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
  
        if (post.userId !== user.uid) {
          throw new UnauthorizedException('You are not authorized to update this post');
        }
  
        return await this.postService.update(id, updatePostDto);
      } catch (error) {
        throw new BadRequestException(`Error updating post: ${error.message}`);
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a blog post by ID' })
    @ApiBearerAuth()
    async remove(@Param('id') id: number, @User() user) {
      try {
        const post = await this.postService.findOne(id);
        if (!post) {
          throw new NotFoundException(`Post with ID ${id} not found`);
        }
  
        if (post.userId !== user.uid) {
          throw new UnauthorizedException('You are not authorized to delete this post');
        }
  
        await this.postService.remove(id);
        return { message: 'Post deleted successfully' };
      } catch (error) {
        throw new BadRequestException(`Error deleting post: ${error.message}`);
      }
    }
  
    @Get('uploads/:fileName')
    async serveImage(@Param('fileName') fileName: string, @Res() res: Response) {
      const filePath = `./uploads/${fileName}`;
      return res.sendFile(filePath, { root: '.' });
    }
  }
  
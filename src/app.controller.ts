import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API health check' })
  getHello() {
    return {
      message: 'Task Manager API is running!',
      version: '1.0.0',
      documentation: '/api/docs',
      endpoints: {
        auth: '/api/v1/auth',
        tasks: '/api/v1/tasks',
        users: '/api/v1/users',
      },
    };
  }
}

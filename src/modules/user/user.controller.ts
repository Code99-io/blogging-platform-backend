import { Controller, Get, Put, Delete, Body, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './update-user.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getUserById(@Req() req): Promise<UserEntity> {
    return this.userService.getUserById(req.user.sub);
  }

  @Put('me')
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(req.user.userId, updateUserDto);
  }

  @Delete('me')
  async deleteUser(@Req() req): Promise<void> {
    return this.userService.deleteUser(req.user.userId);
  }
}

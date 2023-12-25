import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsSelect } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserById(
    id: number,
    select?: FindOptionsSelect<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(id, select);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      emailVerified: false,
    });
    return this.userRepository.save(user);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getUserById(id);

    const updateData: DeepPartial<UserEntity> = {
      name: updateUserDto.name,
    };

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async findAllDropdownData(fields: string[]): Promise<UserEntity[]> {
    const select = convertArrayToObject(fields);
    return await this.userRepository.find({
      select,
    });
  }

  async getUserByEmail(email: string, checkForExists: boolean = true) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'emailVerified'],
    });
    if (!user && checkForExists) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async verifyUser(email: string) {
    const user = await this.getUserByEmail(email);

    const updateData: DeepPartial<UserEntity> = {
      emailVerified: true,
    };

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }

  async changePassword(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    const updateData: DeepPartial<UserEntity> = {
      password,
    };

    this.userRepository.merge(user, updateData);
    return this.userRepository.save(user);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/generated';
import { DatabaseService } from '@modules/database/database.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    return this.dbService.user.create({ data: createUserDto });
  }

  findAll() {
    return this.dbService.user.findMany();
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const foundUser = await this.dbService.user.findUnique({ where });

    if (!foundUser) {
      throw new NotFoundException();
    }

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.dbService.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.dbService.user.delete({ where: { id } });
  }
}

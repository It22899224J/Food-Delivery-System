import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    return { message: 'User registered successfully', user };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'User not found', token: null };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { message: 'Invalid credentials', token: null };
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', token };
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { message: 'User not found', user: null };
    }

    return { message: 'User fetched successfully', user };
  }

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return { message: 'Users fetched successfully', users };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    return { message: 'User updated successfully', user };
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  async updateDriverLocation(id: number, location: string) {
    const driver = await this.prisma.driver.update({
      where: { userId: id },
      data: { location },
    });
    return { message: 'Driver location updated successfully', driver };
  }
}

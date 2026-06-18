import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import {
  AuthUser,
  JwtAccessPayload,
  JwtRefreshPayload,
} from './types/auth-user.type';

type ClientContext = {
  ipAddress?: string;
  userAgent?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, context: ClientContext) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const authUser = this.toAuthUser(user);
    const tokens = await this.createSessionTokens(authUser, context);

    return {
      ...tokens,
      user: authUser,
    };
  }

  async refresh(refreshToken: string, context: ClientContext) {
    const payload = await this.verifyRefreshToken(refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh session.');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!tokenMatches) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid user.');
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    const authUser = this.toAuthUser(user);
    const tokens = await this.createSessionTokens(authUser, context);

    return {
      ...tokens,
      user: authUser,
    };
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    await this.prisma.session.updateMany({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  private async createSessionTokens(user: AuthUser, context: ClientContext) {
    const refreshExpiresAt = this.getRefreshExpiryDate();

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: 'pending',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        expiresAt: refreshExpiresAt,
      },
      select: { id: true },
    });

    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user.id, session.id);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
        '15m') as JwtSignOptions['expiresIn'],
    };
  }

  private async signAccessToken(user: AuthUser) {
    const payload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ??
        'dev-access-secret',
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
        '15m') as JwtSignOptions['expiresIn'],
    });
  }

  private async signRefreshToken(userId: string, sessionId: string) {
    const payload: JwtRefreshPayload = {
      sub: userId,
      sessionId,
      type: 'refresh',
    };

    return this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'dev-refresh-secret',
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
        '30d') as JwtSignOptions['expiresIn'],
    });
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<JwtRefreshPayload>(
        refreshToken,
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ??
            'dev-refresh-secret',
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  private getRefreshExpiryDate() {
    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '30d';
    const days = Number.parseInt(expiresIn, 10);

    if (Number.isFinite(days)) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date;
    }

    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    role: {
      name: string;
      rolePermissions: Array<{
        permission: {
          key: string;
        };
      }>;
    };
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
      permissions: user.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.key,
      ),
    };
  }
}

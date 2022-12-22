import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PoliciesGuard } from './casl/guards/policies.guard';
import { RolesGuard } from './casl/guards/roles.guard';
import { UsersModule } from './users/users.module';
import { CaslModule } from './casl/casl.module';
import { ShiftsModule } from './shifts/shifts.module';
import { config } from './db/data-source';

const RootTypeOrmModule = TypeOrmModule.forRoot({
  ...config,
  autoLoadEntities: true,
} as TypeOrmModuleOptions);

@Module({
  imports: [RootTypeOrmModule, UsersModule, ShiftsModule, AuthModule, CaslModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [AuthModule],
})
export class AppModule {}

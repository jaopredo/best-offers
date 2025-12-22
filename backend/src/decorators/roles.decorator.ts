import { Reflector } from '@nestjs/core';

// Decorador dos níveis de acesso
export const Roles = Reflector.createDecorator<string[]>();

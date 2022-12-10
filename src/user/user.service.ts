import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';

@Injectable()
export class UserService extends PrismaCrudService {
  constructor() {
    super({
      model: 'user',
      allowedJoins: [],
      defaultJoins: [],
    });
  }
}

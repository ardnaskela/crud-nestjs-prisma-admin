import { Injectable } from '@nestjs/common';
import { PrismaCrudService } from 'nestjs-prisma-crud';

@Injectable()
export class PostService extends PrismaCrudService {
  constructor() {
    super({
      model: 'post',
      allowedJoins: [],
      defaultJoins: [],
    });
  }
}

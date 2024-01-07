import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HealthService {
  constructor() {
    setInterval(() => {
      axios.get('http://localhost:15000/services/account/ping');
    }, 100);
  }
}

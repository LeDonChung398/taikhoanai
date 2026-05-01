import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('should return health status', () => {
    const appController = new AppController(new AppService());
    expect(appController.getHealth()).toHaveProperty('status', 'ok');
  });
});

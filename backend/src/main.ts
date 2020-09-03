import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare interface NodeModule {
  hot: {
    accept(path?: () => void, callback?: () => void): void
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: /.+/ });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

import { ValidationPipe } from "@nestjs/common";
import { VersioningType } from "@nestjs/common/enums/version-type.enum";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			origin: "*",
		},
	});

	app.use(helmet());

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});
	app.setGlobalPrefix("api");
	app.useGlobalPipes(new ValidationPipe());

	// Documentation
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("Tech Vault")
		.setDescription("The Tech Vault (E-Commerce) API Description.")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document),
		{
			jsonDocumentUrl: "swagger/json",
		};

	await app.listen(8000);
}
bootstrap();

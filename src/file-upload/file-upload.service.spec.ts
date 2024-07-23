import { Test, TestingModule } from "@nestjs/testing";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { FileUploadService } from "./file-upload.service";

describe("FileUploadService", () => {
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: CloudinaryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

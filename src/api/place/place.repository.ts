import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/module/prisma/prisma.service";

@Injectable()
export class PlaceRepository {
    constructor(private prisma: PrismaService) { }
}
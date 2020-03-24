import { Controller, Get } from '@nestjs/common';
import { DashboardEntity } from "./dashboard.entity";
import { InMemoryDBService } from "@nestjs-addons/in-memory-db";
import { dashboardData } from './dashboard.data';
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: InMemoryDBService<DashboardEntity>) {}
    @Get() 
    getDahboard() {
     return this.dashboardService.create(dashboardData)
    }

}

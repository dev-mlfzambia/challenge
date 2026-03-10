import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { StatusService } from './status.service';

@Injectable()
export class StatusSeederService implements OnModuleInit {
  private readonly logger = new Logger(StatusSeederService.name);

  constructor(private readonly statusService: StatusService) {}

  async onModuleInit() {
    await this.seedStatuses();
  }

  private async seedStatuses() {
    try {
      const statuses = ['Pending', 'Active', 'Inactive', 'Suspended', 'Closed'];

      for (const statusName of statuses) {
        const existingStatus = await this.statusService.findByName(statusName);
        if (!existingStatus) {
          await this.statusService.create({ name: statusName });
          this.logger.log(`Created status: ${statusName}`);
        }
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Unknown error';
      this.logger.warn(
        `Status seeding skipped (schema may not be loaded): ${message}. ` +
          'Ensure core_banking.sql has been imported if you need statuses seeded.',
      );
    }
  }
}

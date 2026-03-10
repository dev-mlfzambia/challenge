import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseFilters,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Service & Guards
import { GroupService } from './group.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { RoleType } from '../../constants/role-type';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TypeOrmUniqueExceptionFilter } from '../../filters/typeorm-unique-exception.filter';


// DTOs
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddClientsToGroupDto } from './dto/add-clients-to-group.dto';
import { UpdateGroupSystemNameDto } from './dto/update-group-system-name.dto';
import { GroupDto, GroupSummaryDto, MiniGroupsDto } from './dto/group.dto';
import { GroupsResponseDto } from './dto/groups-response.dto';
import { GroupFiltersDto } from './dto/group-filters.dto';
import { PageMetaDto, PageOptionsDto } from 'src/common/dtos';


@ApiTags('Group')
@UseFilters(TypeOrmUniqueExceptionFilter)
@Controller('api/v1/groups')
@UseGuards(AuthGuard(), RolesGuard) // Global protection for all routes in this controller
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles(RoleType.LOAN_OFFICER)
  @ApiOperation({ summary: 'Create a new group' })
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupService.create(createGroupDto, req.user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getGroups(
    @Request() req,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() filters: GroupFiltersDto,
  ) {
    const { itemCount, data } = await this.groupService.getGroups({
      user: req.user,
      filters: filters,
      pageOptionsDto,
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    const groups = data.map((group) => new GroupDto(group));
    return GroupsResponseDto.from(groups, pageMetaDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a group by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(RoleType.LOAN_OFFICER)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto, @Request() req) {
    return this.groupService.update(id, updateGroupDto, req.user);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN) // Security step: Only Admins can delete
  remove(@Param('id') id: string, @Request() req) {
    return this.groupService.remove(id, req.user);
  }

  @Post(':id/activate')
  @Roles(RoleType.BRANCH_MANAGER) // Managers only for activation
  activate(@Param('id') id: string, @Request() req) {
    return this.groupService.activate(id, req.user);
  }

  @Post(':id/add-clients')
  @Roles(RoleType.LOAN_OFFICER)
  async addClientsToGroup(
    @Param('id') id: string,
    @Body() addClientsDto: AddClientsToGroupDto,
    @Request() req,
  ) {
    return this.groupService.addClientsToGroup(id, addClientsDto.clientIds, req.user);
  }

  @Patch(':id/system-name')
  @Roles(RoleType.SUPER_USER, RoleType.BRANCH_MANAGER)
  async updateSystemName(
    @Param('id') id: string,
    @Body() updateDto: UpdateGroupSystemNameDto,
    @Request() req
  ) {
    return await this.groupService.updateSystemName(id, updateDto, req.user);
  }
}
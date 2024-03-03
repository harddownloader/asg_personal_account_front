import { PartialType } from '@/pages/api/_core/partial-type'
import { CreateUserDto } from "./create-user.dto"

export class UpdateUserDto extends PartialType(CreateUserDto) {}

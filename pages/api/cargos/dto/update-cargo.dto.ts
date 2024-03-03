import { PartialType } from '@/pages/api/_core/partial-type'
import { CreateCargoDto } from './create-cargo.dto'

export class UpdateCargoDto extends PartialType(CreateCargoDto) {}

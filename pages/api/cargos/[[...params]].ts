import {
  Body,
  createHandler,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from "next-api-decorators"
import { v4 as uuidv4 } from "uuid"

// dto
import { CreateCargoDto, SpacesDto } from "./dto/create-cargo.dto"
import { UpdateCargoDto } from "./dto/update-cargo.dto"

// entities
import { getFirestoreAdmin } from '@/entities/Region/lib/firebase/firebaseAdmin'
import {
  // types
  ICargoFull,

  // api - mappers
  mapCargoDataFromApi,
  CARGOS_DB_COLLECTION_NAME,
} from "@/entities/Cargo"
import { getAllTonesSSR } from "@/entities/Tone"
import { ICargoFullMap } from "@/entities/Cargo/api/mappers/mapCargoDataFromApi"

// shared
import { TFixMeInTheFuture } from "@/shared/types/types"

export class CargosService {
  async create(country: string, createCargoDto: CreateCargoDto) {
    const db = getFirestoreAdmin(country).firestore()
    const cargosRef = await db.collection(CARGOS_DB_COLLECTION_NAME)
    const allTones = await getAllTonesSSR(db)
    const cargoID: string = await uuidv4()

    const cargo = {...createCargoDto, id: cargoID}
    return await cargosRef
      .doc(cargoID)
      .set({
        ...cargo,
        spaces: [...cargo.spaces.map((space)=>({
          ...space,
          photos: space.photos.map((photo) => ({
            ...photo
          }))
        }))]
      })
      .then(() => {
        return {
          ...cargo,
          tone: allTones.find((tone) => tone.id === cargo.toneId)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async findAll(country: string): Promise<Array<ICargoFull> | null> {
    const db = getFirestoreAdmin(country).firestore()
    const cargosRef = await db.collection(CARGOS_DB_COLLECTION_NAME)
    const allTones = await getAllTonesSSR(db)

    return await cargosRef.get()
      .then((cargos: TFixMeInTheFuture) => {
        const cargosList: Array<ICargoFull> = []
        cargos.forEach((cargo: TFixMeInTheFuture) => {
          const cargoDecode = {...cargo.data()}

          cargosList.push(mapCargoDataFromApi({
            id: cargo.id,
            ...cargoDecode,
            tone: allTones.find((tone) => tone.id === cargoDecode.toneId)
          }))
        })

        return cargosList
      })
      .catch((err: TFixMeInTheFuture) => {
        console.log('Error getting documents', err)

        return null
      })
  }

  /* new service - UPD: added proto to backend */
  async findByUserId(country: string, userId: string): Promise<ICargoFullMap[]> {
    const db = getFirestoreAdmin(country).firestore()
    const cargosRef = await db.collection(CARGOS_DB_COLLECTION_NAME)
    const allTones = await getAllTonesSSR(db)

    return await cargosRef
      .where("clientId", "==", userId)
      .get()
      .then((cargos: TFixMeInTheFuture) => {
        return cargos.docs.map((cargo: TFixMeInTheFuture) => {
          const cargoDecode = {...cargo.data()}

          return mapCargoDataFromApi({
            id: cargo.id,
            ...cargoDecode,
            tone: allTones.find((tone) => tone.id === cargoDecode.toneId)
          })
        })
      })
  }

  async findOne(country: string, id: string) {}

  async update(
    country: string,
    id: string,
    updateCargoDto: UpdateCargoDto
  ) {
    const db = getFirestoreAdmin(country).firestore()
    const cargosRef = await db.collection(CARGOS_DB_COLLECTION_NAME)
    const allTones = await getAllTonesSSR(db)

    const cargo = {...updateCargoDto}
    return await cargosRef
      .doc(id)
      .set({
        ...cargo,
        spaces: [...(cargo.spaces as SpacesDto[]).map((space)=>({
          ...space,
          photos: space.photos.map((photo) => ({
            ...photo
          }))
        }))]
      })
      .then(() => ({
        ...cargo,
        id: id,
        tone: allTones.find((tone) => tone.id === cargo.toneId)
      }))
      .catch((error) => {
        console.error(error)
      })
  }

  async remove(country: string, id: string) {}
}

class CargosController {
  private readonly cargosService: CargosService

  constructor() {
    this.cargosService = new CargosService()
  }

  @Post('/:country')
  create(
    @Param('country') country: string,
    @Body(ValidationPipe) createCargoDto: CreateCargoDto,
  ) {
    return this.cargosService.create(country, createCargoDto);
  }

  @Get('/:country')
  findAll(@Param('country') country: string) {
    return this.cargosService.findAll(country);
  }

  @Get('/byUserId/:country/:userId')
  findByUserId(
    @Param('country') country: string,
    @Param('userId') userId: string,
  ) {
    return this.cargosService.findByUserId(country, userId)
  }

  @Get('/:country/:id')
  findOne(
    @Param('country') country: string,
    @Param('id') id: string,
  ) {
    return this.cargosService.findOne(country, id);
  }

  @Patch('/:country/:id')
  update(
    @Param('country') country: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateCargoDto: UpdateCargoDto,
  ) {
    return this.cargosService.update(country, id, updateCargoDto);
  }

  @Delete('/:country/:id')
  remove(
    @Param('country') country: string,
    @Param('id') id: string,
  ) {
    return this.cargosService.remove(country, id);
  }
}

export default createHandler(CargosController)

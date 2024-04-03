import {
  BadRequestException,
  Body,
  createHandler,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  ValidationPipe,
} from "next-api-decorators"

// dto
import { CreateToneDto } from "./dto/create-tone.dto"

// lib
import { exceptionsAdapter } from "@/pages/api/_core/endpoint-catch-handler"
import { getUniqDocId } from "@/pages/api/_lib/getUniqDocId"

// services
import { CargosService } from "@/pages/api/cargos/[[...params]]"

// shared
import { getLogger } from "@/shared/lib/logger/log-util"
import { TFixMeInTheFuture } from "@/shared/types"

// entities
import { getFirestoreAdmin } from '@/entities/Region/lib/firebase/firebaseAdmin'
import {
  // type
  ITone,
  TToneId,

  // const
  TONE_ENTITY,
  TONES_DB_COLLECTION_NAME,
  TONE_API_ERRORS,

  // api - mappers
  mapToneDataFromApi,
} from "@/entities/Tone"
import type { TUserId } from "@/entities/User"

class TonesService {
  private readonly cargosService: CargosService
  protected readonly logger = getLogger(TonesService.name)

  constructor() {
    this.cargosService = new CargosService()
  }

  public async create(country: string, dto: CreateToneDto) {
    try {
      const db = getFirestoreAdmin(country).firestore()
      const tonesRef = await db.collection(TONES_DB_COLLECTION_NAME)

      /* check is tone with this label not exists */
      let isDocExists = false
      await tonesRef.where(TONE_ENTITY.label, "==", dto.label)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data())
            isDocExists = true
          })
        })
        .catch((error) => {
          console.log("TonesService=>create, Error getting documents: ", error)
        })

      if (isDocExists) {
        throw new BadRequestException(TONE_API_ERRORS.ALREADY_EXISTS, [])
      }

      const toneID: string = await getUniqDocId(tonesRef)
      const tone = {
        ...dto, id: toneID
      }

      return await tonesRef
        .doc(toneID)
        .set({ ...tone })
        .then(() => tone)
        .catch((error) => {
          console.error(error)
        })
    } catch (error) {
      console.error(`TonesService create error: ${error}`)

      exceptionsAdapter(error)
    }
  }

  public async findAll(country: string): Promise<Array<ITone> | null> {
    const db = getFirestoreAdmin(country).firestore()
    const tonesRef = await db.collection(TONES_DB_COLLECTION_NAME)
    return await tonesRef.get()
      .then((tones: any) => {
        const tonesList: Array<ITone> = []
        tones.forEach((tone: TFixMeInTheFuture) => {
          const tonesDecode = {...tone.data()}

          tonesList.push(mapToneDataFromApi({
            _id: tone.id,
            ...tonesDecode
          }))
        })

        return tonesList
      })
      .catch((error: TFixMeInTheFuture) => {
        console.log('Error getting documents', error)

        return null
      })
  }

  async findByUserId(country: string, userId: TUserId): Promise<Array<ITone> | null> {
    const userCargos = await this.cargosService.findByUserId(country, userId)

    const tones: ITone[] = []
    const tonesIds: TToneId[] = []
    userCargos.forEach((cargo) => {
      if (cargo?.tone?.id && !tonesIds.includes(cargo.tone.id)) {
        tonesIds.push(cargo.tone.id)
        tones.push(cargo.tone)
      }
    })

    return tones
  }

  async remove(country: string, id: string) {}
}

class TonesController {
  private tonesService: TonesService

  constructor() {
    this.tonesService = new TonesService()
  }

  @Post('/:country')
  public async create(
    @Param('country') country: string,
    @Body(ValidationPipe) dto: CreateToneDto,
  ) {
    return await this.tonesService.create(country, dto)
  }

  @Get('/:country')
  findAll(@Param('country') country: string) {
    return this.tonesService.findAll(country)
  }

  @Get('/:country/byUserId/:userId')
  findByUserId(
    @Param('country') country: string,
    @Param('userId') userId: TUserId,
  ) {
    return this.tonesService.findByUserId(country, userId)
  }

  @Delete('/:country/:id')
  remove(
    @Param('country') country: string,
    @Param('id') id: string,
  ) {
    return this.tonesService.remove(country, id)
  }
}

export default createHandler(TonesController)

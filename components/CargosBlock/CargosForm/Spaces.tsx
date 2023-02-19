import React, { ReactElement, useState, useMemo } from "react"
import {useFieldArray} from "react-hook-form"

// mui
import Button from "@mui/material/Button"
import {Grid, Typography} from "@mui/material"
import TextField from "@mui/material/TextField"

// utils
import { GRID_SPACING } from "@/lib/const"

// store
import { CARGO_FIELD_NAMES } from "@/stores/cargosStore"
import { fixMeInTheFuture } from "@/lib/types"

export type spaceItemType = {
  weight: number,
  photos: Array<string>,
  piecesInPlace: number
}

const spaceItemDefaultValues: spaceItemType = {
  weight: 0,
  photos: [],
  piecesInPlace: 0
}

export interface Space {
  isDisabled: boolean,
  spacesOfCargo: Array<spaceItemType>
  form: {
    registerForm: fixMeInTheFuture
    control: fixMeInTheFuture
    errorsForm: fixMeInTheFuture
  }
}

export const Spaces = ({
                         spacesOfCargo,
                         isDisabled,
                         form: {
                            registerForm,
                            control,
                            errorsForm,
                         }
}: Space) => {
  const initSpaces = (spacesOfCargo && Array.isArray(spacesOfCargo)) ? spacesOfCargo : []
  const [spaces, setSpaces] = useState(initSpaces)

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "spaces", // unique name for your Field Array
  });

  const addSpace = (index=-1) => {
    setSpaces([...spaces, spaceItemDefaultValues])
  }

  const removeSpace = (index: number) => {
    const spacesTmp = [...spaces]
    spacesTmp.splice(index, 1)
    setSpaces([...spacesTmp])
  }

  const addPhoto = (spaceIndex) => {

  }

  const removePhoto = (spaceIndex, photoIndex) => {

  }

  return (
    <>
      {/*<Grid container spacing={GRID_SPACING}>*/}
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Typography variant="h5">Места</Typography>
      </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {spaces.map((space, index) => {
            return (
              <Grid
                container
                spacing={GRID_SPACING}
              >
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={CARGO_FIELD_NAMES.WEIGHT.value}
                    placeholder={CARGO_FIELD_NAMES.WEIGHT.label}
                    label={CARGO_FIELD_NAMES.WEIGHT.label}
                    className={"bg-white rounded"}
                    disabled={isDisabled}
                    {...registerForm(`spaces.${index}.weight`, {
                      required: true,
                    })}
                  />
                  {/*{!!errorsForm.weight && (*/}
                  {/*  <p className="text-sm text-red-500 pt-2">{errorsForm.weight?.message}</p>*/}
                  {/*)}*/}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={CARGO_FIELD_NAMES.NUMBER_OF_SEATS.value}
                    placeholder={CARGO_FIELD_NAMES.NUMBER_OF_SEATS.label}
                    label={CARGO_FIELD_NAMES.NUMBER_OF_SEATS.label}
                    className={"bg-white rounded"}
                    disabled={isDisabled}
                    {...registerForm(`spaces.${index}.numberOfSeats`, {
                      required: true,
                    })}
                  />
                  {/*{!!errorsForm.numberOfSeats && (*/}
                  {/*  <p className="text-sm text-red-500 pt-2">{errorsForm.numberOfSeats?.message}</p>*/}
                  {/*)}*/}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>

                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>

                </Grid>

                <Grid item lg={1} md={6} sm={1} xs={12}>
                  <Button onClick={(e) => removeSpace(index)}>
                    x
                  </Button>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      {/*</Grid>*/}


      <Grid item lg={2} md={2} sm={2} xs={12}>
        <Button onClick={(e) => addSpace()}>
          + Место
        </Button>
      </Grid>
    </>
  )
}

export default Spaces

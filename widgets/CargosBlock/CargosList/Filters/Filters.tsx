import React from 'react'
import { observer } from "mobx-react-lite"

// mui
import {
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material"

// stores
import { CargosStore } from "@/entities/Cargo"
import type { TByDate } from "@/entities/Cargo"
import { SORTING_BY_DATE } from "@/entities/Cargo"

export interface FiltersProps {
  isShowFilters: boolean
}

export const Filters = observer(({ isShowFilters }: FiltersProps) => {
  const sortingByDate: TByDate = CargosStore.filtersOfList.byDate

  const handleChange = () => {
    CargosStore.toggleByDate(
      sortingByDate === SORTING_BY_DATE.ASC
              ? SORTING_BY_DATE.DESC
              : SORTING_BY_DATE.ASC
    )
  }

  return (
    <>
      <Collapse in={isShowFilters} timeout={200}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Сортировка по дате:</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortingByDate}
            label="Сортировка по дате:"
            onChange={handleChange}
          >
            <MenuItem value={SORTING_BY_DATE.ASC}>По убыванию</MenuItem>
            <MenuItem value={SORTING_BY_DATE.DESC}>По возрастанию</MenuItem>
          </Select>
        </FormControl>
      </Collapse>
    </>
  )
})

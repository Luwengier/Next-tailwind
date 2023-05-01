'use client'

import { memo } from 'react'
import { UseFormReturn, FieldValues } from 'react-hook-form'

const TempInput = ({ form }: { form: UseFormReturn<FieldValues> }) => {
  console.log(form.getValues())

  return <div>123</div>
}

export default memo(TempInput)

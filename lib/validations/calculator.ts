import * as z from "zod"

export const calculatorSchema = z.object({
  amount: z.number().min(1, "Amount is required").max(10000000, "Amount must be less than £10,000,000"),
  years: z.number().min(1, "Years is required").max(40, "Term must be 40 years or less"),
  rate: z.number().min(0.1, "Rate is required").max(15, "Rate must be 15% or less"),
  type: z.enum(["repayment", "interest-only"], {
    required_error: "Please select a mortgage type",
  }),
})

export type CalculatorInput = z.infer<typeof calculatorSchema>


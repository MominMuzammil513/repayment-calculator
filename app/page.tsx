"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculatorSchema, type CalculatorInput } from "@/lib/validations/calculator";
import { calculateMortgage, formatCurrency } from "@/utils/calculate";
import Image from "next/image";

export default function MortgageCalculator() {
  const [result, setResult] = useState<{ monthlyPayment: number; totalRepayment: number } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
  });

  const onSubmit = (data: CalculatorInput) => {
    const results = calculateMortgage(data.amount, data.years, data.rate, data.type);
    setResult(results);
  };

  const clearForm = () => {
    reset();
    setResult(null);
  };

  const renderInputField = (
    id: keyof CalculatorInput,
    label: string,
    type: string,
    inputMode: "numeric" | "decimal",
    prefix?: string,
    suffix?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700 font-semibold">
        {label}
      </Label>
      <div
        className={`flex rounded-sm border-2 transition-colors duration-200 ${errors[id]? "border-red bg-red focus-within:border-red focus-within:bg-red" : "border-slate-300 bg-slate-100 focus-within:border-lime focus-within:bg-lime"}`}
      >
        {prefix && (
          <span className={`rounded-e px-3 py-2 flex items-center justify-center focus:bg-lime focus-within:text-slate-900 transition-colors duration-200 ${errors[id]? "bg-red text-white border-red":"text-slate-700 border-slate-300"}`}>
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          className="w-full border-none px-4 ring-0 outline-none appearance-none rounded-none focus:ring-0 focus:outline-none"
          {...register(id, { valueAsNumber: true })}
        />
        {suffix && (
          <span className={`rounded-e px-3 py-2 flex items-center justify-center focus:bg-lime focus-within:text-slate-900 transition-colors duration-200 ${errors[id]? "bg-red text-white border-red":"text-slate-700 border-slate-300"}`}>
            {suffix}
          </span>
        )}
      </div>
      {errors[id] && <p className="text-red text-xs">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-300 p-0 md:p-4 lg:p-6 flex justify-center items-center">
      <Card className="mx-auto lg:max-w-4xl md:max-w-3xl overflow-hidden shadow-xl rounded-none md:rounded-3xl border-none">
        <CardContent className="grid md:grid-cols-2 p-0">
          {/* Form Section */}
          <div className="p-6 md:p-8 bg-white rounded-none">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Mortgage Calculator</h1>
              <button
                onClick={clearForm}
                className="text-slate-500 hover:text-slate-700 text-sm underline underline-offset-2"
              >
                Clear All
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderInputField("amount", "Mortgage Amount", "text", "numeric", "£")}
              <div className="flex sm:flex-row flex-col gap-4">
                {renderInputField("years", "Mortgage Term", "text", "numeric", undefined, "years")}
                {renderInputField("rate", "Interest Rate", "text", "decimal", undefined, "%")}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Mortgage Type</Label>
                <RadioGroup defaultValue="repayment" {...register("type")}>
                  {["repayment", "interest-only"].map((type) => (
                    <div
                      key={type}
                      className={`border-2 rounded-md p-4 ${
                        errors.type ? "border-red-500" : "border-slate-200"
                      } ${
                        watch("type") === type ? "bg-[#c5f82a]/10 border-lime" : ""
                      }`}
                    >
                      <Label htmlFor={type} className="flex items-center space-x-2 cursor-pointer">
                        <RadioGroupItem
                          value={type}
                          id={type}
                          className={`focus-visible:ring-lime flex justify-center items-center ${
                            watch("type") === type ? "border-lime" : "border-slate-4"
                          }`}
                          circleClassName="bg-lime"
                        />
                        <span className={`text-slate-700 font-semibold`}>
                          {type === "repayment" ? "Repayment" : "Interest Only"}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-lime hover:bg-[#b3e626] text-slate-900 rounded-full"
              >
                <div className="w-5 h-6">
                  <Image
                    height={200}
                    width={300}
                    src="/images/icon-calculator.svg"
                    alt="Calculator illustration"
                    className="w-full h-full"
                  />
                </div>
                Calculate Repayments
              </Button>
            </form>
          </div>
          {/* Results Section */}
          <div className="bg-slate-800 p-6 md:p-8 text-white md:rounded-bl-[4rem]">
            {result ? (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Your results</h2>
                  <p className="text-slate-400 sm:text-sm">
                    {`Your results are shown below based on the information you provided. To adjust the results, edit the
                    form and click "calculate repayments" again.`}
                  </p>
                </div>
                <Card className="bg-slate-950/50 p-8 rounded-md border-x-0 border-b-0 border-t-4 border-lime">
                  <div>
                    <h3 className="text-slate-400 font-semibold text-sm mb-2">Your monthly repayments</h3>
                    <p className="text-lime text-4xl font-bold pb-6 border-b border-muted-foreground">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-slate-400 font-semibold text-sm mb-2 pt-6">
                      {`Total you'll repay over the term`}
                    </h3>
                    <p className="text-2xl font-bold text-white">{formatCurrency(result.totalRepayment)}</p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-44 h-44 lg:w-64 lg:h-64">
                  <Image
                    height={1000}
                    width={1000}
                    src="/images/illustration-empty.svg"
                    alt="Calculator illustration"
                    className="w-full h-full"
                  />
                </div>
                <h2 className="text-2xl font-bold">Results shown here</h2>
                <p className="text-slate-400 sm:text-sm font-semibold">
                  {`Complete the form and click "calculate repayments" to see what your monthly repayments would be.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client'

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from './ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig

type UfChartProps = {
  year: number
  data: { year: string; data: { uf: string; total_expenses: number }[] }[]
}

export default function UFChart({ data, year = 2024 }: UfChartProps) {
  let chartData = data.find((item) => Number(item.year) === year)?.data

  if (!chartData) {
    return null
  }

  if (!chartData.some((item) => item.uf === 'Brasil')) {
    const average = {
      uf: 'Brasil',
      total_expenses:
        chartData.reduce((acc, item) => acc + item.total_expenses, 0) /
        chartData.length,
    }

    chartData.push(average)
  }

  chartData = chartData?.sort((a, b) => b.total_expenses - a.total_expenses)

  const totalExpenses = chartData.reduce(
    (acc, item) => acc + item.total_expenses,
    0,
  )
  const formatTotalExpense = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalExpenses)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function CustomToolTip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className="flex items-center gap-1 bg-zinc-100 p-2 rounded border">
          <p className="text-violet-800">{label}: </p>
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(payload[0].value)}
          </span>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Gastos por UF</CardTitle>
        <CardDescription>Dados de {year}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[600px] w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <YAxis
              dataKey="uf"
              type="category"
              tickLine={false}
              tickMargin={10}
              hide
            />
            <XAxis
              dataKey="total_expenses"
              type="number"
              tickMargin={10}
              tickFormatter={(value: number) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value)
              }
            />

            <ChartTooltip content={CustomToolTip} />

            <Bar
              dataKey="total_expenses"
              className="fill-violet-500"
              radius={4}
              layout="vertical"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={'cell-' + index}
                  className={cn(
                    'fill-current',
                    entry.uf === 'Brasil'
                      ? 'fill-violet-700'
                      : 'fill-violet-500',
                  )}
                />
              ))}
              <LabelList
                dataKey={'uf'}
                position={'insideLeft'}
                className="fill-white font-bold"
              />
              <LabelList
                dataKey={'total_expenses'}
                fontSize={10}
                position={'insideRight'}
                className="fill-white font-bold"
                formatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value)
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Total de gastos:
          <span className="font-bold ml-2">{formatTotalExpense}</span>
        </p>
      </CardFooter>
    </Card>
  )
}

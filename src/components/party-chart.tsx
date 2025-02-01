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
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'

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

type PartyChartProps = {
  year: number
  data: {
    year: string
    data: {
      party: string
      senator_ids: string[]
      total_expenses: number
      total_per_senator: number
    }[]
  }[]
}

export default function PartyChart({ data, year = 2024 }: PartyChartProps) {
  const chartData = data.find((item) => Number(item.year) === year)?.data

  if (!chartData) return null

  let partyCharData = chartData?.map((item) => {
    return {
      party: item.party,
      total_per_senator: item.total_per_senator,
    }
  })

  if (!partyCharData.some((item) => item.party === 'Brasil')) {
    const average = {
      party: 'Brasil',
      total_per_senator:
        partyCharData.reduce((acc, item) => acc + item.total_per_senator, 0) /
        partyCharData.length,
    }

    partyCharData.push(average)
  }

  partyCharData = partyCharData?.sort(
    (a, b) => b.total_per_senator - a.total_per_senator,
  )

  if (!chartData) {
    return null
  }

  const totalExpenses = partyCharData.reduce(
    (acc, item) => acc + item.total_per_senator,
    0,
  )

  const formatTotalPerSenatorTotal = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalExpenses)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function CustomToolTip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className="flex items-center gap-1 bg-zinc-100 p-2 rounded border">
          <p className="text-blue-800">{label}: </p>
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
        <CardTitle className="text-2xl">Gastos por Partidos</CardTitle>
        <CardDescription>Dados de {year}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[600px] w-full">
          <BarChart
            accessibilityLayer
            data={partyCharData}
            layout="vertical"
            margin={{
              right: 50,
            }}
          >
            <YAxis
              dataKey="party"
              type="category"
              tickLine={false}
              tickMargin={10}
              hide
            />

            <XAxis
              dataKey="total_per_senator"
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
              dataKey="total_per_senator"
              className="fill-blue-500"
              radius={4}
              layout="vertical"
            >
              {partyCharData.map((entry, index) => (
                <Cell
                  key={'cell-' + index}
                  className={cn(
                    'fill-current',
                    entry.party.includes('Brasil')
                      ? 'fill-blue-700'
                      : 'fill-blue-500',
                  )}
                />
              ))}
              <LabelList
                dataKey={'party'}
                position={'insideLeft'}
                className="fill-white font-bold"
              />
              <LabelList
                dataKey="total_per_senator"
                fontSize={10}
                position={'right'}
                className="fill-slate-900 font-bold"
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
          <span className="font-bold ml-2">{formatTotalPerSenatorTotal}</span>
        </p>
      </CardFooter>
    </Card>
  )
}

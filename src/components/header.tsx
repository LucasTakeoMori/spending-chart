'use client'

import { CalendarDays, Map, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import logo from '../assets/logo.svg'
import Image from 'next/image'
import { Separator } from './ui/separator'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

type HeaderPrpos = {
  year: number
}

export default function Header({ year }: HeaderPrpos) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedExpenseType = searchParams.get('type') || 'uf'
  const pathName = usePathname()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  return (
    <header className="mb-12 flex flex-col gap-10 justify-center items-center md:flex-row md:justify-between">
      <div className="flex items-center gap-4 p-2">
        <Image src={logo} alt="image" width={70} height={70} />

        <div className="flex flex-col gap-1">
          <h1>Gastos dos senadores Brasileiros</h1>
          <p>
            Gastos dos senadores brasileiros total por
            <span className="text-zinc-500 font-bold ml-1 mr-1">
              {selectedExpenseType === 'uf' ? ' estado' : ' partido'}
            </span>
            - CEAPS
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-[90px] h-[82px] flex flex-col items-center justify-center text-xs gap-2 border-black/10 border-2 px-4 py-3 rounded-lg bg-transparent text-muted-foreground hover:bg-black/5 transition ease-in-out duration-300">
              <CalendarDays className="w-4 h-4" />
              Calendário
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Escolha o Ano</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={year.toString()}
              onValueChange={(year) =>
                router.push(
                  `${pathName}?${createQueryString('year', year.toString())}`,
                )
              }
            >
              <DropdownMenuRadioItem className="cursor-pointer" value="2024">
                2024
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="2023">
                2023
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="2022">
                2022
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="2021">
                2021
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="cursor-pointer" value="2020">
                2020
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-10" />

        <div className="flex items-center gap-2">
          <Button
            className={cn(
              'w-[130px] h-[82px] flex flex-col items-center justify-center text-xs gap-2 border-black/10 border-2 px-4 py-3 rounded-lg bg-transparent text-muted-foreground hover:bg-black/5 transition ease-in-out duration-300',
              {
                'bg-black/10 text-black': selectedExpenseType === 'uf',
              },
            )}
            onClick={() =>
              router.push(`${pathName}?${createQueryString('type', 'uf')}`)
            }
          >
            <Map className="w-4 h-4" />
            Gastos por UF
          </Button>

          <Button
            className={cn(
              'w-[130px] h-[82px] flex flex-col items-center justify-center text-xs gap-2 border-black/10 border-2 px-4 py-3 rounded-lg bg-transparent text-muted-foreground hover:bg-black/5 transition ease-in-out duration-300',
              {
                'bg-black/10 text-black': selectedExpenseType === 'party',
              },
            )}
            onClick={() =>
              router.push(`${pathName}?${createQueryString('type', 'party')}`)
            }
          >
            <Flag className="w-4 h-4" />
            Gastos por Partido
          </Button>
        </div>
      </nav>
    </header>
  )
}

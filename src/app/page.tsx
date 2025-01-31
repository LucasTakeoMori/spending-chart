import Header from '@/components/header'
import PartyChart from '@/components/party-chart'
import UFChart from '@/components/uf-chart'

type HomeProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: HomeProps) {
  const expensesType = searchParams.type || 'uf'
  const year = searchParams.year || 2024

  const ufResponse = await fetch(
    `https://apis.codante.io/senator-expenses/summary/by-uf`,
  )
  const ufData = await ufResponse.json()

  const partyResponse = await fetch(
    `https://apis.codante.io/senator-expenses/summary/by-party`,
  )
  const partyData = await partyResponse.json()

  return (
    <main className="container mx-auto py-4">
      <Header year={Number(year)}/>

      {expensesType === 'uf' && <UFChart year={Number(year)} data={ufData} />}
      {expensesType === 'party' && <PartyChart year={Number(year)} data={partyData} />}
    </main>
  )
}

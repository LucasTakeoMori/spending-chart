import Header from '@/components/header'
import PartyChart from '@/components/party-chart'
import UFChart from '@/components/uf-chart'

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;

  const expensesType = resolvedSearchParams.type || 'uf';
  const year = resolvedSearchParams.year || 2024;

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

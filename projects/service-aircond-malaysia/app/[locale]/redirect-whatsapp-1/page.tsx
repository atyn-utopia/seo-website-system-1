import { Metadata } from 'next'
import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ location?: string; message?: string }>
}

export default async function RedirectWhatsAppPage({ searchParams }: Props) {
  const { location, message } = await searchParams
  const locationSlug = location ?? 'all'
  const { phone, source } = await getPhoneNumber(locationSlug)
  const url = waLink(phone, message ?? 'Hi, I need aircond service')

  const { headers: h } = await import('next/headers')
  let host = 'unknown'
  try { host = (await h()).get('host') ?? 'null' } catch { host = 'error' }

  const debugInfo = {
    phone,
    source,
    locationSlug,
    host,
    hasSupabaseUrl: !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasSupabaseKey: !!(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }

  return (
    <>
      <RedirectClient url={url} />
      {/* Temporary debug — remove after confirming */}
      <script dangerouslySetInnerHTML={{ __html: `console.log('DEBUG:',${JSON.stringify(JSON.stringify(debugInfo))})` }} />
    </>
  )
}

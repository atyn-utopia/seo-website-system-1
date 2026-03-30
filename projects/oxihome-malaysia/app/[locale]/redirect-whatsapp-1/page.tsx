import { getPhoneNumber, waLink } from '@/lib/getPhoneNumber'
import RedirectClient from './RedirectClient'

export const revalidate = 60

export default async function RedirectWhatsapp1() {
  const phone = await getPhoneNumber('all')
  const url = waLink(phone, 'Hi Oxihome, I am interested in renting an oxygen machine.')
  return <RedirectClient url={url} />
}

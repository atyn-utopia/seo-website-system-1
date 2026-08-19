import type { Metadata } from 'next'
import { seoAlternates } from '@/lib/seoAlternates'
import { Plus_Jakarta_Sans, Inter, Noto_Sans_SC } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/config/site'
import '../globals.css'
import { ogImages } from '@/lib/ogImage'

// Two families, deliberately distinct — CLAUDE.md forbids one doing both jobs.
// Plus Jakarta Sans carries the headings: it holds a tight tracking at small
// display sizes, which matters here because the h1 is capped at 38px and has
// to earn its presence from proportion rather than scale. Inter sets the body.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})

const notoSC = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sc',
  weight: ['400', '500', '700', '800'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: t('title'),
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t('description'),
    alternates: seoAlternates(locale),
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_MY' : locale === 'en' ? 'en_MY' : 'ms_MY',
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      images: ogImages(locale),
    },
    robots: { index: true, follow: true },
  }
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale === 'zh' ? 'zh-Hans' : locale}
      className={`${jakarta.variable} ${inter.variable} ${notoSC.variable}`}
    >
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script defer src="https://webcore.utopiaai.my/t.js" data-website={siteConfig.domain}></script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

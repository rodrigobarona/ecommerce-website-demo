import Sections from '@/components/Sections/Sections';
import queryDatoCMS from '@/utils/queryDatoCMS';
import { draftMode } from 'next/headers';
import RealTimeSections from '@/components/Sections/RealTimeSections';
import { HomeDocument, SiteLocale } from '@/graphql/generated';
import { notFound } from 'next/navigation';
import { getFallbackLocale } from '@/app/i18n/settings';

type Params = {
  params: {
    lng: SiteLocale;
    slug: string;
  };
};

export default async function Home({ params: { lng, slug } }: Params) {
  const fallbackLng = await getFallbackLocale();
  const { isEnabled } = draftMode();

  const data = await queryDatoCMS(
    HomeDocument,
    {
      locale: lng,
      fallbackLocale: [fallbackLng],
      slug,
    },
    isEnabled
  );

  if (!data.home) notFound();

  return (
    <>
      {!isEnabled && (
        <Sections
          locale={lng}
          sections={data.home.sections as any} 
        />
      )}
      {isEnabled && (
        <RealTimeSections
          initialData={data}
          locale={lng}
          token={process.env.DATOCMS_READONLY_API_TOKEN || ''}
          query={HomeDocument}
          variables={{ locale: lng, fallbackLocale: [fallbackLng] }}
        />
      )}
    </>
  );
}
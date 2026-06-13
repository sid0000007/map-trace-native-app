'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LocationNotFoundError } from '@/domains/locations/errors';
import { useLocation } from '@/domains/locations/hooks';

const LocationsMap = dynamic(
  () => import('@/components/locations-map').then((m) => m.LocationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-gray-500">Loading map…</div>
    ),
  },
);

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locationId = id ?? '';
  const { data, isPending, isError, error, refetch } = useLocation(locationId);
  const notFound = error instanceof LocationNotFoundError;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-6">
      <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
        ← Back to map
      </Link>

      <div className="mt-4">
        {isPending ? (
          <p className="text-gray-500">Loading location…</p>
        ) : notFound ? (
          <p className="text-gray-600">We couldn&apos;t find that location.</p>
        ) : isError ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-gray-600">Something went wrong: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : data ? (
          <article className="flex flex-col gap-4">
            {data.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.imageUrl}
                alt={data.name}
                className="h-60 w-full rounded-xl object-cover"
              />
            ) : null}

            <div>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              {data.category ? (
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium capitalize text-blue-700">
                  {data.category}
                </span>
              ) : null}
            </div>

            <p className="leading-relaxed text-gray-700">{data.description}</p>

            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.address ? (
                <div>
                  <dt className="text-xs uppercase text-gray-400">Address</dt>
                  <dd className="text-gray-800">{data.address}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs uppercase text-gray-400">Coordinates</dt>
                <dd className="text-gray-800">
                  {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                </dd>
              </div>
            </dl>

            <div className="h-72 overflow-hidden rounded-xl border border-gray-200">
              <LocationsMap locations={[data]} />
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

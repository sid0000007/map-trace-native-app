'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocations } from '@/domains/locations/hooks';

// Leaflet touches `window`, so load the map client-side only.
const LocationsMap = dynamic(
  () => import('@/components/locations-map').then((m) => m.LocationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-gray-500">Loading map…</div>
    ),
  },
);

export default function HomePage() {
  const { data, isPending, isError, error, refetch, isFetching } = useLocations();

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Locations</h1>
          <p className="text-sm text-gray-500">Web demo · data from a Cloudflare Worker API</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={isFetching}
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {isPending ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Loading locations…
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-gray-600">Couldn&apos;t load locations: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          No locations to show.
        </div>
      ) : (
        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="w-full overflow-y-auto border-b border-gray-200 md:max-h-[calc(100vh-73px)] md:w-80 md:border-b-0 md:border-r">
            <ul>
              {data.map((location) => (
                <li key={location.id} className="border-b border-gray-100">
                  <Link href={`/locations/${location.id}`} className="block px-6 py-3 hover:bg-gray-50">
                    <span className="font-medium">{location.name}</span>
                    {location.category ? (
                      <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        {location.category}
                      </span>
                    ) : null}
                    {location.address ? (
                      <span className="mt-0.5 block text-sm text-gray-500">{location.address}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <section className="h-[60vh] flex-1 md:h-auto">
            <LocationsMap locations={data} />
          </section>
        </div>
      )}
    </main>
  );
}

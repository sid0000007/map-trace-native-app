'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocations } from '@/domains/locations/hooks';

// Leaflet touches `window`, so load the map client-side only.
const LocationsMap = dynamic(
  () => import('@/components/locations-map').then((m) => m.LocationsMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  },
);

export default function HomePage() {
  const { data, isPending, isError, error, refetch, isFetching } = useLocations();

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Locations</h1>
          <p className="text-xs text-muted-foreground">Data from a Cloudflare Worker API</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </Button>
      </header>

      <div className="h-64 shrink-0 border-b">
        {!isError && data && data.length > 0 ? (
          <LocationsMap locations={data} />
        ) : isPending ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Map unavailable
          </div>
        )}
      </div>

      <section className="flex-1 overflow-y-auto p-3">
        {isPending ? (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">Couldn&apos;t load locations: {error.message}</p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        ) : data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No locations to show.</p>
        ) : (
          <ul className="space-y-2">
            {data.map((location) => (
              <li key={location.id}>
                <Link href={`/locations/${location.id}`}>
                  <Card className="gap-0 p-3 transition-colors hover:bg-accent">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{location.name}</p>
                        {location.address ? (
                          <p className="truncate text-xs text-muted-foreground">{location.address}</p>
                        ) : null}
                      </div>
                      {location.category ? (
                        <Badge variant="secondary" className="shrink-0 capitalize">
                          {location.category}
                        </Badge>
                      ) : null}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

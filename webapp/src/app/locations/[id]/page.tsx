'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LocationNotFoundError } from '@/domains/locations/errors';
import { useLocation } from '@/domains/locations/hooks';

const LocationsMap = dynamic(
  () => import('@/components/locations-map').then((m) => m.LocationsMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  },
);

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const locationId = id ?? '';
  const { data, isPending, isError, error, refetch } = useLocation(locationId);
  const notFound = error instanceof LocationNotFoundError;

  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center gap-2 border-b px-2 py-2">
        <Link href="/" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
          ← Back
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : notFound ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            We couldn&apos;t find that location.
          </p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">Something went wrong: {error.message}</p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        ) : data ? (
          <article className="space-y-4">
            {data.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.imageUrl}
                alt={data.name}
                className="h-48 w-full rounded-xl object-cover"
              />
            ) : null}

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold">{data.name}</h1>
              {data.category ? (
                <Badge variant="secondary" className="capitalize">
                  {data.category}
                </Badge>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{data.description}</p>

            <div className="space-y-3 text-sm">
              {data.address ? (
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Address</p>
                  <p>{data.address}</p>
                </div>
              ) : null}
              <div>
                <p className="text-xs uppercase text-muted-foreground">Coordinates</p>
                <p>
                  {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="h-56 overflow-hidden rounded-xl border">
              <LocationsMap locations={[data]} />
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

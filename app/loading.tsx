import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function Loading() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center">
      <LoadingSpinner label="Loading AfiyaPal..." />
    </main>
  );
}

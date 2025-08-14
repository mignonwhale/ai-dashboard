export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="loading loading-spinner loading-lg"></div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <div className="card-body">
        <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-base-300 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-base-300 rounded mb-4"></div>
        <div className="h-8 bg-base-300 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export function SkeletonText() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-base-300 rounded w-full"></div>
      <div className="h-4 bg-base-300 rounded w-5/6"></div>
      <div className="h-4 bg-base-300 rounded w-4/6"></div>
    </div>
  )
}
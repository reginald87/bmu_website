interface SkeletonProps {
 className?: string;
}

export const SkeletonPulse = ({ className = '' }: SkeletonProps) => (
 <div className={`animate-pulse bg-gray-200 ${className}`} />
);

export const CardSkeleton = () => (
 <div className="bg-white p-6 shadow-sm border border-gray-100">
 <div className="flex items-start gap-4">
 <SkeletonPulse className="w-12 h-12 flex-shrink-0" />
 <div className="flex-1 space-y-3">
 <SkeletonPulse className="h-4 w-3/4" />
 <SkeletonPulse className="h-3 w-1/2" />
 <SkeletonPulse className="h-3 w-2/3" />
 </div>
 </div>
 </div>
);

export const ProgramCardSkeleton = () => (
 <div className="bg-white overflow-hidden shadow-sm border border-gray-100">
 <SkeletonPulse className="h-48 w-full" />
 <div className="p-6 space-y-4">
 <div className="flex items-center gap-2">
 <SkeletonPulse className="h-5 w-20" />
 <SkeletonPulse className="h-5 w-16" />
 </div>
 <SkeletonPulse className="h-6 w-full" />
 <SkeletonPulse className="h-4 w-3/4" />
 <div className="flex items-center gap-4 pt-4 border-t">
 <SkeletonPulse className="h-4 w-24" />
 <SkeletonPulse className="h-4 w-24" />
 </div>
 </div>
 </div>
);

export const NewsCardSkeleton = () => (
 <div className="bg-white overflow-hidden shadow-sm border border-gray-100">
 <SkeletonPulse className="h-56 w-full" />
 <div className="p-5 space-y-3">
 <SkeletonPulse className="h-4 w-24" />
 <SkeletonPulse className="h-5 w-full" />
 <SkeletonPulse className="h-4 w-full" />
 <SkeletonPulse className="h-4 w-2/3" />
 </div>
 </div>
);

export const EventCardSkeleton = () => (
 <div className="bg-white p-6 shadow-sm border border-gray-100 flex gap-4">
 <div className="flex-shrink-0">
 <SkeletonPulse className="w-16 h-16" />
 </div>
 <div className="flex-1 space-y-3">
 <SkeletonPulse className="h-5 w-full" />
 <SkeletonPulse className="h-4 w-3/4" />
 <div className="flex gap-2">
 <SkeletonPulse className="h-6 w-20" />
 <SkeletonPulse className="h-6 w-20" />
 </div>
 </div>
 </div>
);

export const TableRowSkeleton = () => (
 <div className="flex items-center gap-4 py-4 border-b border-gray-100">
 <SkeletonPulse className="h-4 w-8" />
 <SkeletonPulse className="h-10 w-10" />
 <div className="flex-1 space-y-2">
 <SkeletonPulse className="h-4 w-1/3" />
 <SkeletonPulse className="h-3 w-1/2" />
 </div>
 <SkeletonPulse className="h-8 w-24" />
 </div>
);

export const HeroSkeleton = () => (
 <div className="relative h-[500px] overflow-hidden">
 <SkeletonPulse className="h-full w-full" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center space-y-6 max-w-2xl px-4">
 <SkeletonPulse className="h-12 w-3/4 mx-auto" />
 <SkeletonPulse className="h-6 w-full" />
 <SkeletonPulse className="h-6 w-2/3 mx-auto" />
 <div className="flex gap-4 justify-center pt-4">
 <SkeletonPulse className="h-12 w-40" />
 <SkeletonPulse className="h-12 w-40" />
 </div>
 </div>
 </div>
 </div>
);

export const StatCardSkeleton = () => (
 <div className="bg-white p-6 shadow-sm">
 <div className="flex items-center justify-between">
 <div className="space-y-2">
 <SkeletonPulse className="h-4 w-24" />
 <SkeletonPulse className="h-8 w-16" />
 </div>
 <SkeletonPulse className="w-12 h-12" />
 </div>
 </div>
);

export const ListItemSkeleton = ({ count = 3 }: { count?: number }) => (
 <div className="space-y-3">
 {Array.from({ length: count }).map((_, i) => (
 <div key={i} className="flex items-center gap-3 p-3">
 <SkeletonPulse className="w-10 h-10 flex-shrink-0" />
 <div className="flex-1 space-y-2">
 <SkeletonPulse className="h-4 w-3/4" />
 <SkeletonPulse className="h-3 w-1/2" />
 </div>
 </div>
 ))}
 </div>
);

export const PageSkeleton = () => (
 <div className="min-h-screen bg-gray-50 pt-[140px] pb-12">
 <div className="container-custom">
 <div className="space-y-8">
 <SkeletonPulse className="h-8 w-1/3" />
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {Array.from({ length: 6 }).map((_, i) => (
 <CardSkeleton key={i} />
 ))}
 </div>
 </div>
 </div>
 </div>
);

export const DashboardSkeleton = () => (
 <div className="min-h-screen bg-gray-50">
 <div className="bg-[#1E1E1E] h-16" />
 <div className="container-custom py-8">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
 {Array.from({ length: 4 }).map((_, i) => (
 <StatCardSkeleton key={i} />
 ))}
 </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-6">
 <SkeletonPulse className="h-64 w-full" />
 <SkeletonPulse className="h-64 w-full" />
 </div>
 <div className="space-y-6">
 <SkeletonPulse className="h-48 w-full" />
 <SkeletonPulse className="h-48 w-full" />
 </div>
 </div>
 </div>
 </div>
);

// src/components/CardSkeleton.tsx
export default function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-2/5" />
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
          {[1, 2, 3].map(i => <div key={i} className="h-8 bg-slate-100 rounded" />)}
        </div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-slate-100 rounded-lg" />
            <div className="w-16 h-9 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

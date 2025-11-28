import Link from 'next/link'

export function Logo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
        <img src="/logo.png" alt="StreetBite Logo" className="w-full h-full object-contain" />
      </div>
      <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
        Street<span className="text-primary">Bite</span>
      </span>
    </div>
  )
}

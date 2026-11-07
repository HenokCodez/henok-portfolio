import { cn } from '../../lib/cn';

export interface GrainProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Grain({ className, ...props }: GrainProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-10 overflow-hidden',
        className,
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%), url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .5 0\'/></filter><rect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'.09\'/></svg>")',
        }}
      />
    </div>
  );
}

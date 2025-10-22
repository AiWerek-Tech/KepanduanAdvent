interface PathfinderLogoIconProps {
  className?: string
  size?: number
}

export default function PathfinderLogoIcon({ className = "", size = 24 }: PathfinderLogoIconProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="https://clubministries.org/wp-content/uploads/Pathfinder_Logo-Flat_Small.png"
        alt="Pathfinder Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
interface IAIconProps {
  className?: string
  size?: number
}

export default function IAIcon({ className = "", size = 24 }: IAIconProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="https://wiki.pathfindersonline.org/images/thumb/e/e5/IA_logo.png/80px-IA_logo.png"
        alt="Investiture Achievement"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}
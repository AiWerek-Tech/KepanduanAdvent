interface PathfinderClassIconProps {
  className?: string
  size?: number
  pathfinderClass: string
}

export default function PathfinderClassIcon({ 
  className = "", 
  size = 60, 
  pathfinderClass 
}: PathfinderClassIconProps) {
  const classIcons = {
    'FRIEND': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/Friend1.png',
    'COMPANION': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/companion1.png',
    'EXPLORER': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/explorer1.png',
    'RANGER': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/ranger1.png',
    'VOYAGER': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/voyager1.png',
    'GUIDE': 'https://pathfinders.adventistchurch.com/wp-content/uploads/sites/15/2021/09/guide1.png'
  }

  const classLabels = {
    'FRIEND': 'Sahabat',
    'COMPANION': 'Teman',
    'EXPLORER': 'Penyelidik',
    'RANGER': 'Perintis',
    'VOYAGER': 'Penjelajah',
    'GUIDE': 'Pemimpin'
  }

  const iconUrl = classIcons[pathfinderClass as keyof typeof classIcons]
  const label = classLabels[pathfinderClass as keyof typeof classLabels]

  if (!iconUrl) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-xs font-bold">?</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={iconUrl}
        alt={`${label} Class Icon`}
        width={size}
        height={size}
        className="object-contain drop-shadow-lg"
      />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
    </div>
  )
}
interface Props {
  url: string | null
  username: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' }

export default function Avatar({ url, username, size = 'md' }: Props) {
  if (url) {
    return <img src={url} alt={username} className={`${sizes[size]} rounded-full object-cover`} />
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold`}>
      {username[0]?.toUpperCase()}
    </div>
  )
}

import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'

export function CreatePostButton() {
  return (
    <Link
      href="/create-post"
      className="fixed bottom-8 right-8 bg-red-700 text-white p-4 rounded-full shadow-lg hover:bg-red-600 hover:text-black transition-transform transform hover:scale-110"
      title="Create a Post"
    >
      <AddIcon style={{ fontSize: 30 }} />
    </Link>
  )
}

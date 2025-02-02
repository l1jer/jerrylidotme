export default function Footer() {
  return (
    <footer className="py-8 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} Jerry Li, @digolasforge. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 
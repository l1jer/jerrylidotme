export default function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50"></div>
      <div className="relative container mx-auto px-6 py-10">
        <div className="flex flex-col items-center">
          <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
          <p className="text-gray-300  text-center">
            © {new Date().getFullYear()} Jerry Li,  <a className=" text-gray-300 hover:text-indigo-300" href="https://digolas-forge.com" target="_blank" rel="noopener noreferrer">@Digolas Forge</a>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Crafted with passion and creativity
          </p>
        </div>
      </div>
    </footer>
  )
} 
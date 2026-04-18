export default function Footer() {
  return (
    <footer className="w-full py-10 mt-20 border-t border-black">
      <div className="container text-center text-black">
        <div className="text-2xl font-bold mb-2 tracking-tight uppercase">LUXENIA</div>
        <p className="text-gray-600">© {new Date().getFullYear()} Все права защищены</p>
      </div>
    </footer>
  );
}

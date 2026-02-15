export default function Footer() {
  return (
    <footer className="w-full py-10 mt-20 border-t border-gold">
      <div className="container text-center text-graphite font-sans">
        <div className="text-gold font-serif text-xl mb-2">LumaSkin</div>
        <p className="opacity-70">© {new Date().getFullYear()} Все права защищены</p>
      </div>
    </footer>
  );
}

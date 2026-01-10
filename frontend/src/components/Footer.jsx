function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-12 bg-black/70 backdrop-blur border-t border-white/10
    flex items-center justify-center text-xs text-slate-400">
      © {new Date().getFullYear()} Jobify — Apply Smarter
    </footer>
  );
}

export default Footer;

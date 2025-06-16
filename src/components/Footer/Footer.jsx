import "./_footer.scss"

function Footer() {

  const isChatActive = typeof document !== "undefined" && document.body.classList.contains("chat-active")

  if (isChatActive) return null

  return (
    <>
      <footer className="sticky top-[100vh] bg-gradient-to-r from-indigo-900 to-fuchsia-900 py-4 text-center border-t border-secondary">
        <p className="text-white text-sm">Impressum</p>
      </footer>
    </>
  );
}

export default Footer;

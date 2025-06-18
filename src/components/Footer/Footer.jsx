import "./_footer.scss";

function Footer() {
  const isChatActive =
    typeof document !== "undefined" &&
    document.body.classList.contains("chat-active");

  if (isChatActive) return null;

  return (
    <>
      <footer className="sticky top-[100vh] bg-[linear-gradient(220deg,#cf82e4_0%,rgba(78,50,235,0.1)_20%,rgba(78,50,235,0.3)_100%)] py-4 text-center border-t border-secondary">
        <p className="text-white text-sm">Impressum</p>
      </footer>
    </>
  );
}

export default Footer;

export const metadata = {
  title: "Zombies Smartrónica M&M",
  description: "Juego promocional para Smartrónica M&M",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

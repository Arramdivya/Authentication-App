import './globals.css';

export const metadata = {
  title: 'Next.js Auth Assignment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}

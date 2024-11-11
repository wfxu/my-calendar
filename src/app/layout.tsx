import "@/ui/globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics  gaId="G-D8RYGRY0ZR" />
      </body>
    </html>
  );
};

export default RootLayout;
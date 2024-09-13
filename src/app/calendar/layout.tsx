export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-4/5 h-4/5 flex">
          {children}
        </div>
      </div>
    );
  }
  
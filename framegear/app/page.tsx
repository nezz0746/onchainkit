'use client';

import { Frame } from '@/components/Frame';
import { Header } from '@/components/Header';
import { RedirectModalProvider } from '@/components/RedirectModalContext/RedirectModalContext';

export default function Home() {
  return (
    <RedirectModalProvider>
      <div className="mx-auto flex flex-col items-center gap-8 pb-16">
        <Header />
        <div className="w-1/3 border">
          <Frame url={'http://localhost:3000/stream/1733'} />
        </div>
      </div>
    </RedirectModalProvider>
  );
}

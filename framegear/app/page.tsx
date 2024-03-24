'use client';

import { Frame } from '@/components/Frame';
import { Header } from '@/components/Header';
import { RedirectModalProvider } from '@/components/RedirectModalContext/RedirectModalContext';
import { PrivyProvider, useLogin, usePrivy } from '@privy-io/react-auth';
import { optimismSepolia } from 'viem/chains';

export default function Home() {
  return (
    <RedirectModalProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://i.imgur.com/4HHBqUV.png',
          },
          loginMethods: ['wallet'],
          defaultChain: optimismSepolia,
        }}
      >
        <div className="mx-auto gap-8 pb-16">
          <Header />
          <main className="flex w-full flex-col items-center p-4">
            <div className="w-full border sm:w-2/3 md:w-1/2 xl:w-1/3">
              <Frame url={'http://localhost:3000/stream/1733'} />
            </div>
          </main>
        </div>
      </PrivyProvider>
    </RedirectModalProvider>
  );
}

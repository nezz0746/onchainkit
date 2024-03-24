import { postFrame } from '@/utils/postFrame';
import { frameResultsAtom, mockFrameOptionsAtom } from '@/utils/store';
import { useAtom } from 'jotai';
import {
  ChangeEvent,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ExternalLinkIcon, ResetIcon, RocketIcon } from '@radix-ui/react-icons';
import { useRedirectModal } from '@/components/RedirectModalContext/RedirectModalContext';
import { FrameMetadataWithImageObject } from '@/utils/frameResultToFrameMetadata';
import * as Player from '@livepeer/react/player';
import { LoadingIcon } from '@livepeer/react/assets';
import { fetchFrame } from '@/utils/fetchFrame';
import { createWalletClient, custom, encodeFunctionData, erc20Abi, parseEther } from 'viem';
import { AOAbi } from './constants';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { optimismSepolia } from 'viem/chains';

const FrameContext = createContext<{
  metadata: FrameMetadataWithImageObject;
  setMetadata: React.Dispatch<React.SetStateAction<FrameMetadataWithImageObject | null>>;
  // @ts-expect-error
}>({});

export function Frame({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<FrameMetadataWithImageObject | null>(null);

  const getResults = useCallback(async () => {
    const result = await fetchFrame(url);
    if (result) {
      setMetadata(result.metadata);
    }
  }, [setMetadata, url]);

  useEffect(() => {
    getResults();
  }, [getResults]);

  if (!metadata) {
    return <PlaceholderFrame />;
  }

  return (
    <FrameContext.Provider value={{ metadata, setMetadata }}>
      <ValidFrame />
    </FrameContext.Provider>
  );
}

function ValidFrame() {
  const { metadata } = useContext(FrameContext);
  const [inputText, setInputText] = useState('');

  const { image, input, buttons } = metadata;
  const imageAspectRatioClassname =
    metadata.image.aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[1.91/1]';

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value),
    [],
  );

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {metadata?.video ? (
        <Player.Root
          autoPlay
          src={[
            {
              src: metadata?.video?.src,
              type: 'hls',
              width: 200,
              height: 200,
              // @ts-ignore: Temporarily non-standard mime type
              mime: 'html5/application/vnd.apple.mpegurl',
            },
          ]}
        >
          <Player.Container className="h-full w-full overflow-hidden object-cover outline-none transition">
            <Player.Video title="Live stream" className={'h-full w-full transition'} />
            <Player.LoadingIndicator className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 relative h-full w-full bg-black/50 backdrop-blur">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoadingIcon className="h-8 w-8 animate-spin" />
              </div>
              <p>Loading...</p>
            </Player.LoadingIndicator>

            <Player.ErrorIndicator
              matcher="all"
              className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoadingIcon className="h-8 w-8 animate-spin" />
              </div>
              <p>Loading...</p>
            </Player.ErrorIndicator>

            <Player.ErrorIndicator
              matcher="offline"
              className="animate-in fade-in-0 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold sm:text-2xl">Stream is offline</div>
                  <div className="text-xs text-gray-100 sm:text-sm">
                    Playback will start automatically once the stream has started
                  </div>
                </div>
                <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
              </div>
            </Player.ErrorIndicator>

            <Player.ErrorIndicator
              matcher="access-control"
              className="data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <div className="text-lg font-bold sm:text-2xl">Stream is private</div>
                  <div className="text-xs text-gray-100 sm:text-sm">
                    It looks like you don't have permission to view this content
                  </div>
                </div>
                <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
              </div>
            </Player.ErrorIndicator>
          </Player.Container>
        </Player.Root>
      ) : (
        <img
          className={`w-full ${imageAspectRatioClassname} object-cover`}
          src={image.src}
          alt=""
        />
      )}
      <div className="dark:bg-content-light flex flex-col gap-2 bg-gray-100 px-4 py-2">
        {!!input && (
          <input
            className="bg-input-light border-light border p-2 text-black"
            type="text"
            placeholder={input.text}
            onChange={handleInputChange}
          />
        )}
        <div className="flex flex-wrap gap-4">
          {buttons?.map((button, index) =>
            button ? (
              <FrameButton
                inputText={inputText}
                key={button.label}
                index={index + 1}
                button={button}
                state={metadata.state}
              >
                {button.label}
              </FrameButton>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorFrame() {
  // TODO: implement -- decide how to handle
  // - simply show an error?
  // - best effort rendering of what they do have?
  // - maybe just ValidFrame with a red border?
  return <PlaceholderFrame />;
}

function PlaceholderFrame() {
  return (
    <div className="flex flex-col">
      <div className="bg-farcaster flex aspect-[1.91/1] w-full"></div>
      <div className="bg-button-gutter-light dark:bg-content-light flex flex-wrap gap-2 px-4 py-2">
        <FrameButton state={{}} index={1} inputText="">
          Get Started
        </FrameButton>
      </div>
    </div>
  );
}

function FrameButton({
  children,
  button,
  index,
  inputText,
  state,
}: PropsWithChildren<{
  button?: NonNullable<FrameMetadataWithImageObject['buttons']>[0];
  index: number;
  inputText: string;
  state: any;
}>) {
  const { openModal } = useRedirectModal();
  const [isLoading, setIsLoading] = useState(false);
  const { setMetadata } = useContext(FrameContext);
  const [mockFrameOptions] = useAtom(mockFrameOptionsAtom);
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const handleClick = useCallback(async () => {
    if (button?.action === 'post' || button?.action === 'post_redirect') {
      // TODO: collect user options (follow, like, etc.) and include
      const confirmAction = async () => {
        const result = await postFrame(
          {
            buttonIndex: index,
            url: button.target!,
            state: JSON.stringify(state),
            // TODO: make these user-input-driven
            castId: {
              fid: 0,
              hash: '0xthisisnotreal',
            },
            inputText,
            fid: 0,
            messageHash: '0xthisisnotreal',
            network: 0,
            timestamp: 0,
          },
          mockFrameOptions,
        );
        // TODO: handle when result is not defined
        if (result) {
          setMetadata(result.metadata);
        }
      };
      setIsLoading(true);
      if (button?.action === 'post_redirect') {
        openModal(confirmAction);
      } else {
        confirmAction();
      }
      setIsLoading(false);
      return;
    } else if (button?.action === 'link') {
      const onConfirm = () => window.open(button.target, '_blank');
      openModal(onConfirm);
    } else if (button?.action === 'tx') {
      console.log(button.target);
      let txData;
      try {
        const txData = await fetch(button.target, {
          method: 'POST',
          headers: {
            contentType: 'application/json',
          },
        }).then((res) => res.json());

        console.log(txData);
      } catch (error) {
        // Hardcod Yoink
        // reason: hacking
        txData = encodeFunctionData({
          abi: AOAbi,
          functionName: 'mint',
          args: ['0x1Bf2667d60b1048665da1c045C087c8083f59c05', parseEther('69')],
        });
      }
      const provider = await wallet.getEthereumProvider();
      const client = createWalletClient({
        chain: optimismSepolia,
        transport: custom(provider),
      });

      await client.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: '0x8CD2f066688bDa3Fec69df363F915285946968dC',
        data: txData,
        value: undefined,
      });
    }
    // TODO: implement other actions (mint, etc.)
  }, [
    button?.action,
    button?.target,
    index,
    inputText,
    mockFrameOptions,
    openModal,
    setMetadata,
    state,
  ]);

  const buttonIcon = useMemo(() => {
    switch (button?.action) {
      case 'link':
        return <ExternalLinkIcon />;
      case 'post_redirect':
        return <ResetIcon />;
      case 'mint':
        return <RocketIcon />;
      default:
        null;
    }
  }, [button?.action]);

  return (
    <button
      className="border-button flex w-[45%] grow items-center justify-center gap-1 border bg-white px-4 py-2 text-black"
      type="button"
      onClick={handleClick}
      disabled={isLoading || button?.action === 'mint'}
    >
      <span className="block max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap">
        {children}
      </span>
      {buttonIcon}
    </button>
  );
}

function MockFrameOptions() {
  const [mockFrameOptions, setMockFrameOptions] = useAtom(mockFrameOptionsAtom);
  const toggleFollowing = useCallback(() => {
    setMockFrameOptions((prev) => ({ ...prev, following: !prev.following }));
  }, [setMockFrameOptions]);
  return (
    <fieldset>
      <label>
        Following{' '}
        <input onClick={toggleFollowing} type="checkbox" checked={!!mockFrameOptions.following} />
      </label>
    </fieldset>
  );
}

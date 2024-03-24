import { FrameImageMetadata, FrameMetadataType } from '@coinbase/onchainkit/frame';

const getHLSUrl = (url: string) => {
  if (url?.includes('m3u8')) {
    return url as `${string}m3u8`;
  }
  return undefined;
};

export type FrameMetadataWithImageObject = FrameMetadataType & {
  image: FrameImageMetadata;
  video?: { src: `${string}m3u8`; type: string };
};

export function frameResultToFrameMetadata(
  result: Record<string, string>,
): FrameMetadataWithImageObject {
  const postUrl = result['fc:frame:post_url'];
  const buttons = [1, 2, 3, 4].map((idx) =>
    result[`fc:frame:button:${idx}`]
      ? {
          action: result[`fc:frame:button:${idx}:action`] || 'post',
          label: result[`fc:frame:button:${idx}`],
          target: result[`fc:frame:button:${idx}:target`] || postUrl,
        }
      : undefined,
  );
  const imageSrc = result['fc:frame:image'];
  const videoSrc = getHLSUrl(result['fc:frame:video']);
  const videoType = result['fc:frame:video:type'];
  const imageAspectRatio = result['fc:frame:image:aspect_ratio'];
  const inputText = result['fc:frame:input'];
  const input = inputText ? { text: inputText } : undefined;
  const rawState = result['fc:frame:state'];
  const rawRefreshPeriod = result['fc:frame:refresh_period'];
  const refreshPeriod = rawRefreshPeriod ? parseInt(rawRefreshPeriod, 10) : undefined;
  const state = rawState ? JSON.parse(decodeURIComponent(result['fc:frame:state'])) : undefined;

  return {
    buttons: buttons as any,
    image: { src: imageSrc, aspectRatio: imageAspectRatio as any },
    video: videoSrc ? { src: videoSrc, type: videoType } : undefined,
    input,
    postUrl,
    state,
    refreshPeriod,
  };
}

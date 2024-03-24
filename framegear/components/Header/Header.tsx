import ColorfulText from '../ColorText';

export function Header() {
  return (
    <div className={`border-pallette-line flex w-full justify-center border-b py-8`}>
      <div className="max-w-layout-max flex w-full items-center justify-between">
        <h1>
          <ColorfulText text="ALWAYSON" className="text-4xl" />
        </h1>
      </div>
    </div>
  );
}

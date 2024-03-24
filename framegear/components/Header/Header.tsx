import ColorfulText from '../ColorText';
import { PrivyProvider, useLogin, usePrivy } from '@privy-io/react-auth';

export function Header() {
  const { login, user } = usePrivy();
  return (
    <div className={`border-pallette-line flex w-full justify-center border-b py-8`}>
      <div className="max-w-layout-max flex w-full items-center justify-between">
        <h1>
          <ColorfulText text="ALWAYSON" className="text-4xl" />
        </h1>
        {user ? <p>{user.wallet?.address}</p> : <button onClick={login}>login</button>}
      </div>
    </div>
  );
}

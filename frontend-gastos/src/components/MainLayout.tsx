import { ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '20px' }}>{children}</main>
    </>
  );
};

export default MainLayout;

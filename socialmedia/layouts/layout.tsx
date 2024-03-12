import React from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/nav';
import { Toaster } from 'react-hot-toast';

const Layout = (props) => {
  return (
    <>
      <Nav />
      <main>
        {props.children}
      </main>
      <Toaster/>
    </>
  );
};

export default Layout;



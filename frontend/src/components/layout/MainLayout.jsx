import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import EnquireNow from '../../pages/Enquireform';

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        {/* The Outlet will render the specific page component (e.g., Home, About, etc.) */}
        <Outlet /> 
      </main>
      <Footer />
      <EnquireNow/>
    </>
  );
}

export default MainLayout;
import React from 'react';

const Layout = (props) => {
  return (
    <div className="App">
      <main className="Main">{props.children}</main>
    </div>
  );
};
export default Layout;

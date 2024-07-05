import '@src/styles/globals.css';
import  Navbar  from '@src/components/Navbar';

const Rootlayout = ({ children }) => (
<html lang='en'>
    <body>
        <main className='h-screen flex flex-col justify-center items center'>
          <Navbar/>
          {children}
        </main>
      
    </body>
  </html>
);

export default Rootlayout
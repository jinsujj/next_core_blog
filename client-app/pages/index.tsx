import type { NextPage } from 'next'
import Body from './components/Body';
import Footer from './components/Footer';
import Header from './components/Header';
import { useSelector } from '../store';

const Home: NextPage = () => {
  const headerDelay = useSelector((state) => state.common.headerDelay);
  
  return (
    <>
    {headerDelay!! && <Header/>}
    <Body/>
    <Footer/>
    </>
  )
}

export default Home;

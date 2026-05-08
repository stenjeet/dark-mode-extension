import './styles/App.scss';
import Header from './components/Header/Header';
import GlobalMode from './components/GlobalMode/GlobalMode';
import CurrentMode from './components/CurrentMode/CurrentMode';
import SiteList from './components/SiteList/SiteList';
import Footer from './components/Footer/Footer';



function App() {

  return (
    <div className='app'>
		<Header/>
		<div className='content'>
			<GlobalMode/>
			<CurrentMode/>
			<SiteList/>
			<Footer/>
		</div>
    </div>
  )
}

export default App;

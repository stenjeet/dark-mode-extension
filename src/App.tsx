import CurrentDomain from './components/CurrentDomain/CurrentDomain';
import SiteToggle from './components/SiteToggle/SiteToggle';
import './styles/App.scss';
import GlobalToggle from './components/GlobalToggle/GlobalToggle';
import SiteList from './components/SiteList/SiteList';



function App() {

  return (
    <div className='app'>
		<div className='container'>
			<div className='extensionMode'>
				<p className='extensionMode__title'>Dark Theme</p>
				<GlobalToggle/>
			</div>
			<div className='siteSetting'>
				<CurrentDomain />
				<SiteToggle/>
			</div>
			<SiteList/>
		</div>
    </div>
  )
}

export default App;
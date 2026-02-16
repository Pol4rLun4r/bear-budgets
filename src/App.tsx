// mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core"

// components
import Sidebar from './components/sidebar/Sidebar';
import MainContainer from './components/mainContainer/MainContainer';

// styles
import './style/Global.css'
import { Notifications } from '@mantine/notifications';

const App = () => {
  return (
    <MantineProvider
      defaultColorScheme='dark'
      theme={{ fontFamily: 'Google Sans' }}
    >
      <Notifications/>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <MainContainer />
      </div>
    </MantineProvider>
  )
}

export default App;
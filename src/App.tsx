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
      theme={{ fontFamily: 'primary_font', primaryColor: 'violet' }}

    >
      <Notifications />
      <>
        <Sidebar />
        <MainContainer />
      </>
    </MantineProvider>
  )
}

export default App;
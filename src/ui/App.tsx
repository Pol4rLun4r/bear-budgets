// mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core"

// components
import Main from './components/main/@Main';
import Sidebar from './components/sidebar/@Sidebar';
import ManagerPage from './pages/managerPage/@ManagerPage';

// styles
import './style/Global.css';
import { Notifications } from '@mantine/notifications';

const App = () => {
  return (
    <MantineProvider
      defaultColorScheme='dark'
      theme={{ fontFamily: 'primary_font', primaryColor: 'violet' }}
    >
      <Notifications />
      <Main>
        <Sidebar />
        <ManagerPage />
      </Main>
    </MantineProvider>
  )
}

export default App;
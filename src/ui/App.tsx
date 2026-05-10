// mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from "@mantine/core"
import { Notifications } from '@mantine/notifications';

// components
import Main from './components/main/@Main';
import Sidebar from './components/sidebar/@Sidebar';
import FrameBar from './components/frameBar/@FrameBar.tsx';
import ManagerPage from './pages/managerPage/@ManagerPage';

// styles
import './style/Global.css';

const App = () => {
  return (
    <MantineProvider
      defaultColorScheme='dark'
      theme={{ fontFamily: 'primary_font', primaryColor: 'violet' }}
    >
      <Notifications />
      <Main>
        <FrameBar />
        <Sidebar />
        <ManagerPage />
      </Main>
    </MantineProvider>
  )
}

export default App;
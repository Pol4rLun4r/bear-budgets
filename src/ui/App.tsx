// mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from "@mantine/core"
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';

// react-query
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// components
import Main from './components/main/@Main';
import Sidebar from './components/sidebar/@Sidebar';
import FrameBar from './components/frameBar/@FrameBar.tsx';
import ManagerPage from './pages/managerPage/@ManagerPage';

// styles
import './style/Global.css';

// dayJS
import 'dayjs/locale/pt-br';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme='dark'
        theme={{ fontFamily: 'primary_font', primaryColor: 'violet', defaultGradient: { from: 'violet', to: 'grape', deg: 45 } }}
      >
        <DatesProvider settings={{locale: 'pt-br', firstDayOfWeek: 0}}>
          <Notifications />
          <Main>
            <FrameBar />
            <Sidebar />
            <ManagerPage />
          </Main>
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App;
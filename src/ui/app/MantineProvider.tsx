// mantine style
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// mantine components
import { createTheme, MantineProvider as Provider, v8CssVariablesResolver } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates'

// dayJS
import 'dayjs/locale/pt-br';

const MantineProvider = ({ children }: { children: React.ReactNode }) => {
    const theme = createTheme({
        fontFamily: 'primary_font',
        primaryColor: 'violet',
        defaultGradient: { from: 'violet', to: 'grape', deg: 45 }
    })

    return (
        <Provider
            cssVariablesResolver={v8CssVariablesResolver}
            defaultColorScheme='dark'
            theme={theme}
        >
            <DatesProvider settings={{ locale: 'pt-br', firstDayOfWeek: 0 }}>
                <Notifications />
                {children}
            </DatesProvider>
        </Provider >
    )
}

export default MantineProvider;
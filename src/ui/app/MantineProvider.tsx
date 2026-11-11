// mantine style
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

// mantine components
import { createTheme, Modal, MantineProvider as Provider, TextInput, v8CssVariablesResolver } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates'

// styles
import notificationClasses from './notifications/Notifications.module.css';

// dayJS
import 'dayjs/locale/pt-br';

const theme = createTheme({
    fontFamily: 'primary_font',
    primaryColor: 'violet',
    defaultGradient: { from: 'violet', to: 'grape', deg: 45 },
    components: {
        Modal: Modal.extend({
            defaultProps: {
                padding: "lg",
                radius: "lg",
                centered: true,
                overlayProps: { backgroundOpacity: 0.55 }
            }
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                radius: "lg"
            }
        })
    }
})

const MantineProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider
            cssVariablesResolver={v8CssVariablesResolver}
            defaultColorScheme='dark'
            theme={theme}
        >
            <DatesProvider settings={{ locale: 'pt-br', firstDayOfWeek: 0 }}>
                <Notifications classNames={{ root: notificationClasses.notificationsRoot }} />
                {children}
            </DatesProvider>
        </Provider >
    )
}

export default MantineProvider;
import { useNotification } from 'context/NotificationContext';
import MDSnackbar from 'components/MDSnackbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const NotificationManager = () => {
    const { notification, hideNotification } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'info':
                return <InfoIcon />;
            default:
                return <CheckCircleIcon />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'customBlue';
        }
    };
    const handleClose = (event, reason) => {
        hideNotification();
    };

    return (
        <MDSnackbar
            open={notification.open}
            close={handleClose}
            title={notification.title}
            color={getColor(notification.type)}
            content={notification.content}
            dateTime={new Date().toLocaleString()}
            icon={getIcon(notification.type)}
            autoHideDuration={notification.duration}

        />

    );
};

export default NotificationManager;
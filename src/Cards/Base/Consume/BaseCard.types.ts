import { Theme } from '../../../Models/Constants/Enums';

export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    noData: boolean;
    children?: React.ReactNode;
    theme?: Theme;
}

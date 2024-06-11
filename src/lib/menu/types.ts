export interface MenuItem {
    id: string;
    value: string;
}

export interface MenuProps {
    menuList: MenuItem[][];
    getAction: (param1: string, param2: string) => void;
}
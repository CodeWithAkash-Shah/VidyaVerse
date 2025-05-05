import DesktopNavbar from "./DesktopNavbar";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <DesktopNavbar />
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
};

export default MainLayout;

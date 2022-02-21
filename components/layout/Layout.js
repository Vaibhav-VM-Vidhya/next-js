import Mainnavigation from "../Navigation/Mainnavigation";
import react from 'react';



const Layout = props =>{
    return(<>
    <Mainnavigation></Mainnavigation>
    <main>{props.children}</main>
    </>);
}
export default Layout;
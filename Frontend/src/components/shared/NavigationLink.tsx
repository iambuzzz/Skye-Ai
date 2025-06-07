import { Link } from "react-router-dom";
type Props = {
    to: string;
    bg: string;
    text: string;
    textcolor: string;
    onClick: () => Promise<void>;
};
const NavigationLink = (props:Props)=> {
    return (
        <Link className="nav-link" to={props.to} onClick={props.onClick} style={{ 
        
            backgroundColor: props.bg, 
            color: props.textcolor, 
            boxShadow: `0 0 10px ${props.bg}`,
        }}>
            {props.text}
        </Link>
    );
}
export default NavigationLink;
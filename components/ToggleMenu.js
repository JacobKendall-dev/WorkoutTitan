
import {useState} from "react"




export function ToggleMenu(){

    const [openMenu, setOpenMenu] = useState(null)


    const toggleMenu = (menuName) => {
       setActiveMenu(prev => (prev === menuName ? null: menuName))
    }
}
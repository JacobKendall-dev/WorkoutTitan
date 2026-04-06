
import {useState} from "react"




const ToggleMenuController= () => {

    const [openMenu, setOpenMenu] = useState(null)


    const toggleMenu = (menuName) => {
       setActiveMenu(prev => (prev === menuName ? null: menuName))
    }

    const closeMenu = (menuName) => {
        setActiveMenu(null)
    }

    return {openMenu, toggleMenu, closeMenu}
}

export default ToggleMenuController 
import Menu from '../Models/modelMenu.js';


export async function getAllMenu() {
    try {
        const menus = await Menu.find();
        return menus;
    } catch(error) {
        console.log(error.message);
        return null;
    }
};




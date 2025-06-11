import Menu from '../Models/modelMenu.js';
import generateProdId from '../Utils/generateProdID.js';

export async function getProduct(prodId) {
    try {
        const Item = await Menu.findOne({ prodId: prodId });
        return Item;
    } catch (error) {
        return null;
    }
}

// Update produkt details
export async function updateMenuDetails(prodId, title, desc, price) {
    try {
        const updatedMenu = await Menu.findOneAndUpdate(
            { prodId: prodId },
            { title, desc, price },
            { new: true }
        );
        return updatedMenu;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

// Create new menu item
export async function createNewMenuItem(prodId, title, desc, price) {
    try {
        const newProdId = prodId || generateProdId();
        const newMenu = new Menu({
            prodId: newProdId,
            title,
            desc,
            price
        });
        await newMenu.save();
        return newMenu;
    } catch (error) {
        console.log(error.message);
        return null;        
    }
}

// Delete menu item
export async function deleteMenu(prodId) {
    try {
        const result = await Menu.findOneAndDelete({ prodId: prodId });
        return result;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

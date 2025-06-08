import Menu from '../Models/modelMenu.js';

export async function getProduct(prodId) {
    try {
        const Item = await Menu.findOne({ prodId: prodId });
        return Item;
    } catch (error) {
        return null;
    }
};


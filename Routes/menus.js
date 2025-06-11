import { Router } from 'express';
import { getAllMenu } from '../Service/menusContoller.js';
import { updateMenuDetails, createNewMenuItem, deleteMenu } from '../Middlewares/menuAuth.js';
import { authenticateUser, adminVerification } from '../Middlewares/userAuth.js';

const router = Router();

// GET all menu
router.get('/', async (req, res, next) => {
    const menus = await getAllMenu();
    if(menus) {
        res.json({
            success : true,
            menus : menus
        });
    } else {
        next({
            status :404,
            message : 'No menu fond'
        });
    }
});

// Updates product in menu
router.put('/:prodId', authenticateUser, adminVerification, async (req, res) => {
    const { title, desc, price } = req.body;
    const prodId = req.params.prodId;
    const updatedMenu = await updateMenuDetails(prodId, title, desc, price);
    if (updatedMenu) {
        res.status(200).json(updatedMenu);
    } else {
        res.status(404).json({ message: 'Menu item not found or could not be updated' });
    }
});

// Adds new product to menu
router.post('/', authenticateUser, adminVerification, async (req, res) => {
    const { prodId, title, desc, price } = req.body;
    const menu = await createNewMenuItem(
        prodId,
        title,
        desc,
        price
    );
    if (menu) {
        res.status(201).json(menu);
    } else {
        res.status(500).json({ message: 'Could not create menu item'});
    }
});

// Deletes product in menu
router.delete('/:prodId', authenticateUser, adminVerification, async (req, res, next) => {
    const prodId = req.params.prodId;
    const result = await deleteMenu(prodId);
    if (result) {
        res.status(200).json({ message: 'Menu item deleted', deleted: result});
    } else {
        res.status(404).json({ message: 'Menu item not found'});
    }
});

export default router;
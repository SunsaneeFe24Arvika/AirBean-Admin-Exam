import { Router } from 'express';
import { getAllMenu } from '../Service/menusContoller.js';

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



export default router;
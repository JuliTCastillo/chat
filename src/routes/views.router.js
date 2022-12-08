import { Router } from "express";

const router = Router(); 

//creamos los endpoint 
router.get('/', (req, res)=>{
    res.render('chat')
})

export default router;
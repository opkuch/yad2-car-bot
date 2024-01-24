import { Request, Response } from "express";
import { userService } from "./user.service";
async function getUsers(req: Request, res: Response) {
    try {
        const users = await userService.query()
        res.json(users)
    } catch (err) {
        res.status(500).send({ err: 'Failed to query users' });
    }
}

async function signup(req: Request, res: Response) {
    try {
        const { phonenumber, car_preferences_params } = req.body;
        console.log(car_preferences_params);
        
        const user = await userService.register(phonenumber, car_preferences_params);
        res.json(user);
    } catch (err) {
        res.status(500).send({ err: 'Failed to signup' });
    }
}

async function updateUser(req: Request, res: Response) {
	try {
		const user = req.body;
		const savedUser = await userService.update(user);
		res.send(savedUser);
	} catch (err) {
		res.status(500).send({ err: 'Failed to update user' });
	}
}


export { signup, getUsers, updateUser }
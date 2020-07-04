import User from "../models/user";
import { database } from "../../lib/database";
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt';

export const create = async (req: Request, res: Response) => {
  try {
    const user: User = await database('users').select().where({
      email: req.body.email
    }).first();
    if (typeof user !== 'undefined' && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const info = { userId: user.id };
      const token = jwt.sign(info, process.env.JWT_SECRET);
      res.json({token, user});
    } else {
      res.sendStatus(404);
    }
  } catch(error) {
    console.error(error);
    res.sendStatus(500);
  }
};
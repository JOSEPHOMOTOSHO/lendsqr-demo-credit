import { CreateUserDto } from '@/dtos/users.dto';
import { User } from '@/interfaces/user.interface';
import AuthService from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import karma from '../adjutor/index'


class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const userOnBlacklist = await karma.isOnBlacklist(req.body.email);
      if (userOnBlacklist) {
        res.status(400).json({ status: 'error', message: 'this user has been blacklisted', data: null })
      }
      const createUser: User = await this.authService.register(userData);
      res.status(201).json({ status: 'success', message: 'User created successfully', data: createUser });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { token, user } = await this.authService.login(userData);

      res.status(200).json({ status: 'success', message: 'Login successful', data: { token, user } });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

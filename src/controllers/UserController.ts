import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { User } from '../models/User';

class UserController {

  async listAll(request: Request, response: Response) {
    const userRepository = getCustomRepository(UsersRepository);

    const users = await userRepository.find();
    const length = await userRepository.count();

    if (!users) {
      throw new AppError("There are no users!");
    }

    return response.status(200).json({
      length,
      data: users,
    });
  }

  async listById(request: Request, response: Response) {
    const { id } = request.params;

    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne({ id });

    if (!user) {
      throw new AppError("User not exists!", 400);
    }

    return response.status(200).json(user);
  }

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    });

    if (!(await schema.isValid(request.body))) {
      throw new AppError("Validation Failed!");
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExistis = await usersRepository.findOne({ email });

    if (userAlreadyExistis) {
      throw new AppError("User already exists!");
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).send(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const data: User = request.body;

    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne({ id });

    if (!user) {
      throw new AppError("User not exists!", 404);
    }

    await userRepository.update(id, data);
    const userUpdate = await userRepository.findOne({ id });

    return response.status(200).json({ userUpdate });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findOne({ id });

    if (!user) {
      throw new AppError("User not exists!", 404);
    }

    const test = await userRepository.delete({ id });

    return response.status(200).json({ test });
  }
}

export { UserController };

import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {

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

}

export { UserController };

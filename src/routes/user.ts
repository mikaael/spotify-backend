import { Router } from 'express';
import { PrismaClient, User } from '@prisma/client';
import { Playlist } from '@prisma/client';

function validateProfileEmail(email: string) {
  const regexLocalPart = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  const regexDomain = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const part = email.split('@');

  if (part.length !== 2) {
    return false;
  }

  if (!regexLocalPart.test(part[0])) {
    return false;
  }

  if (!regexDomain.test(part[1])) {
    return false;
  }

  return true;
}

function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

const router = Router();
const prisma = new PrismaClient();

router.get('/', async function (req, res) {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/:id', async function (req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Id is not valid',
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  return res.json(user);
});

router.post('/', async function (req, res) {
  const {
    email,
    password,
    username,
    birth_date,
    gender_id,
    profile_url,
    region_id,
  } = req.body;

  const userBirthDate = new Date(birth_date);

  const birthDateDay = userBirthDate?.getDate();
  const birthDateMonth = userBirthDate?.getMonth();
  const birthDateYear = userBirthDate?.getFullYear();

  if (
    !email ||
    !password ||
    !username ||
    (!birthDateDay && birthDateDay !== 0) ||
    (!birthDateMonth && birthDateMonth !== 0) ||
    (!birthDateYear && birthDateYear !== 0) ||
    (!gender_id && gender_id !== 0)
  ) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message:
          'Email, password, username, profile_url and birth_date is required!',
      },
    });
  }

  if (!validateProfileEmail(email)) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Email is not valid',
      },
    });
  }

  const userExist = await prisma.user.findFirst({ where: { email } });
  if (userExist?.email == email) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Email already exist',
      },
    });
  }

  if (profile_url && (profile_url?.length === 0 || !validURL(profile_url))) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'URL is not valid',
      },
    });
  }

  // const birthDate = new Date(
  //   birthDateYear,
  //   birthDateMonth,
  //   birthDateDay
  // ).getTime();

  // if (birthDate <= 0) {
  //   return res.status(400).json({
  //     body: {
  //       status_code: 400,
  //       status: 'failed',
  //       message: 'Date is not valid',
  //     },
  //   });
  // }

  const user = await prisma.user.create({
    data: {
      gender_id: Number(gender_id),
      region_id: region_id ?? 1,
      email,
      password,
      username,
      profile_url: profile_url || '',
      birth_date: new Date(birthDateYear, birthDateMonth, birthDateDay),
    },
  });
  res.status(201).json({
    body: {
      status_code: 201,
      status: 'success',
      message: 'User created successfully',
      data: user,
    },
  });
});

router.patch('/:id', async function (req, res) {
  const { id } = req.params;

  const {
    email,
    password,
    username,
    birth_date,
    gender_id,
    profile_url,
    region_id,
  } = req.body;

  if (email && !validateProfileEmail(email)) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'Email is not valid',
      },
    });
  }

  // const userExistByEmail = await prisma.user.findFirst({ where: { email } });
  // if (userExistByEmail?.email == email) {
  //   return res.status(400).json({
  //     body: {
  //       status_code: 400,
  //       status: 'failed',
  //       message: 'Email already exist',
  //     },
  //   });
  // }

  if (profile_url && (profile_url.length === 0 || !validURL(profile_url))) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'URL is not valid',
      },
    });
  }

  // const birthDate = new Date(
  //   birthDateYear,
  //   birthDateMonth,
  //   birthDateDay
  // ).getTime();

  // if (birthDate <= 0) {
  //   return res.status(400).json({
  //     body: {
  //       status_code: 400,
  //       status: 'failed',
  //       message: 'Date is not valid',
  //     },
  //   });
  // }

  const userExistById = await prisma.user.findFirst({
    where: { id: Number(id) },
  });

  if (!userExistById) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'User not found',
      },
    });
  }

  const updateUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      gender_id:
        gender_id && gender_id !== 0 ? gender_id : userExistById.gender_id,
      region_id:
        region_id && region_id !== 0 ? region_id : userExistById.region_id,
      email: email ?? userExistById.email,
      password: password ?? userExistById.password,
      username: username ?? userExistById.username,
      profile_url: profile_url ?? userExistById.profile_url,
      birth_date: birth_date ? new Date(birth_date) : userExistById.birth_date,
    },
  });
  res.status(200).json({
    body: {
      status_code: 200,
      status: 'success',
      message: 'User updated successfully',
      data: updateUser,
    },
  });
});

router.delete('/:id', async function (req, res) {
  const { id } = req.params;

  const userExistById = await prisma.user.findFirst({
    where: { id: Number(id) },
  });
  if (!userExistById) {
    return res.status(400).json({
      body: {
        status_code: 400,
        status: 'failed',
        message: 'User not found',
      },
    });
  }

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(201).json({
    body: {
      status_code: 200,
      status: 'success',
      message: 'User delete successfully',
    },
  });
});

export { router };

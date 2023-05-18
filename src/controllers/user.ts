import { User } from "entity/User";
import { RouteHandlerMethod } from "fastify";
import { Child } from "@entity/Child";
import { MultipartFile, MultipartValue } from "@fastify/multipart";
import * as fs from "fs";
import { randomUUID } from "crypto";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";

export const profile: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;

  const user = await request.server.db.manager.findOne(User, {
    where: { id: userId },
  });
  return user;
};

export const getMe: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const user = await request.server.db.manager.findOne(User, {
    where: { id: userId }
  });
  return user;
}

interface UpdateData {
  name: MultipartValue<string>;
  email: MultipartValue<string>;
  address: MultipartValue;
  mobile: MultipartValue<string>;
  photo?: MultipartFile;
}

type CreateUser = {
  name: string;
  email: string;
  password: string;
  mobile: string;
  line1: string;
  line2: string;
  country: string;
  city: string;
  postcode: string;
  role: string;
  nurseryId: number;
  classroomId: string;
}

export const addUserasMaster: RouteHandlerMethod = async (request, reply) => {

  const { name, email, password, mobile, line1, line2, city, country, postcode, role, nurseryId } = request.body as CreateUser;

  const userRepository = request.server.db.getRepository(User);
  const hashpass = await request.server.bcrypt.hash(password);
  const newUser = userRepository.create({
    email: email,
    name: name,
    password: hashpass,
    mobile: mobile,
    address: { line1, line2, city, country, postcode },
    role: role,
    nurseryId: nurseryId,
    userCount: 0,
    adminCount: 0,
    classroomId: 0,
  });

  return await userRepository.save(newUser);
};

type CreateNursery = {
  name: string;
  fname: string;
  lname: string;
  DOB: string;
  email: string;
  password: string;
  mobile: string;
  line1: string;
  line2: string;
  country: string;
  city: string;
  postcode: string;
  role: string;
  nurseryId: number;
  classroomId: string;
}

export const addUserasAdmin: RouteHandlerMethod = async (request, reply) => {

  const { name, fname, lname, DOB, email, password, mobile, line1, line2, city, country, postcode, role, nurseryId, classroomId } = request.body as CreateNursery;
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await userRepository.findOne({ where: { id: userId } });
  const hashpass = await request.server.bcrypt.hash(password);
  const newUser = userRepository.create({
    email: email,
    name: name,
    fname: fname,
    lname: lname,
    DOB: DOB,
    password: hashpass,
    mobile: mobile,
    address: { line1, line2, city, country, postcode },
    role: role,
    nurseryId: nurseryId,
    userCount: 0,
    adminCount: 0,
    classroomId: classroomId === '' ? 0 : parseInt(classroomId),
  });
  if (currentUser && role === "Admin") {
    await userRepository.save({
      id: userId,
      adminCount: currentUser.adminCount + 1,
    });
  } else if (currentUser && role === "Nursery") {
    await userRepository.save({
      id: userId,
      userCount: currentUser.userCount + 1,
    });
  }
  return await userRepository.save(newUser);


};

export const updateProfile: RouteHandlerMethod = async (request, reply) => {
  const {
    photo,
    email: { value: email },
    name: { value: name },
    address: { value: address },
    mobile: { value: mobile },
  } = <UpdateData>request.body;
  const id = request.user.id;

  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id } });

  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  let path = user.photo;

  if (photo) {
    const buffer = await photo.toBuffer();

    path = `uploads/images/avatars/${randomUUID() + "_" + photo.filename}`;

    fs.appendFileSync(`storage/${path}`, buffer);

    path = "assets/" + path;
  }

  const updated = await userRepository.save({
    id,
    photo: path,
    email,
    name,
    address: JSON.parse(address as string),
    mobile,
  });

  reply.send(updated);
};

export const getChildren: RouteHandlerMethod = async (request, reply) => {

  const id = request.user.id;

  const user = await request.server.db.manager.findOne(User, {
    where: { id },
    relations: { children: true },
  });


  if (!user) {
    reply.unauthorized("Unauthorized");
    return;
  }

  if (user.role === "Admin") {
    const childRepo = await request.server.db.getRepository(User);
    const parents = await childRepo.find({ relations: { children: true } });
    let children = [];
    for (let i = 0; i < parents.length; i++) {
      if (parents[i].nurseryId !== user.nurseryId) continue;
      if (parents[i].children) {
        for (let j = 0; j < parents[i].children.length; j++) {
          children.push(parents[i].children[j]);
        }
      }
    }
    const childrenRepo = await request.server.db.getRepository(Child);
    let childrens = [];
    for(let i = 0; i < children.length; i++) {
      
      let tmp = await childrenRepo.findOne({ where: { id: children[i].id }, relations: { parent: true } });
      childrens.push(tmp);
    }
    return childrens;
  }

  if (user.role === "Nursery") {
    const childRepo = await request.server.db.getRepository(User);
    const parents = await childRepo.find({ relations: { children: true } });
    let children = [];
    for (let i = 0; i < parents.length; i++) {
      if (parents[i].nurseryId !== user.nurseryId) continue;
      if (parents[i].children) {
        for (let j = 0; j < parents[i].children.length; j++) {
          if(parents[i].children[j].classroomId !== user.classroomId) continue;
          children.push(parents[i].children[j]);
        }
      }
    }
    return children;
  }

  return user.children;
};

export const addChildren: RouteHandlerMethod = async (request, reply) => {
  const { id: userId } = request.params as any;
  const childRepository = request.server.db.getRepository(Child);

  const childData: Partial<Child> = request.body as any;

  const newChild = childRepository.create({
    parent: { id: userId },
    ...childData,
  });

  return await childRepository.save(newChild);
};

type IChild = {
  name: string;
  fname: string;
  lname: string;
  gender: string;
  DOB: Dayjs;
  address: string;
  ethnicity: string;
  religion: string;
  languages: string;
  fname1: string;
  fname2: string;
  fname3: string;
  lname1: string;
  lname2: string;
  lname3: string;
  email1: string;
  email2: string;
  email3: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  
  parentId: string;
  classroomId: string;
}

export const addChild: RouteHandlerMethod = async (request, reply) => {
  const { name, fname, lname, gender, DOB, address, ethnicity, religion, languages, parentId, classroomId, fname1, lname1, email1, mobile1, fname2, lname2, email2, mobile2, fname3, lname3, email3, mobile3 } = request.body as IChild;
  const childRepository = await request.server.db.getRepository(Child);
  const newChild = childRepository.create({
    name: name,
    fname: fname,
    lname: lname,
    gender: gender,
    DOB: dayjs(DOB).format('YYYY-MM-DD').toString(),
    address: address,
    additionals: { ethnicity: ethnicity, religion: religion, languages: languages.split(/ ,/) },
    parentId: parseInt(parentId),
    classroomId: parseInt(classroomId),
    father_fname: fname1,
    father_lname: lname1,
    father_email: email1,
    father_mobile: mobile1,
    mother_fname: fname2,
    mother_lname: lname2,
    mother_email: email2,
    mother_mobile: mobile2,
    third_fname: fname3,
    third_lname: lname3,
    third_email: email3,
    third_mobile: mobile3,
  });

  // const childRepository = request.server.db.getRepository(Child);

  // const childData: Partial<Child> = request.body as any;

  // const newChild = childRepository.create({
  //   ...childData,
  // });


  return await childRepository.save(newChild);
}

export const changePassword: RouteHandlerMethod = async (request, reply) => {
  const { password, current_password } = <{ password: string; current_password: string }>request.body;

  const userId = request.user.id;

  const userRepository = request.server.db.getRepository(User);

  const hashPassword = await request.server.bcrypt.hash(password);

  const user = await userRepository.findOne({ where: { id: userId } });

  if (user) {
    if (await request.server.bcrypt.compare(current_password, user.password)) {
      user.password = hashPassword;
      try {
        await userRepository.save(user);

        return { success: true };
      } catch (error) {
        reply.internalServerError();
      }
    } else {
      reply.unauthorized("Password is not correct");
    }
  } else {
    reply.unauthorized();
  }
};

export const getParent: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await userRepository.findOne({ where: { id: userId } });
  if (currentUser && currentUser.role != "Admin") {
    reply.unauthorized("You can't access to this data.");
    return;
  }

  return await userRepository.find({ where: { role: "user", nurseryId: currentUser?.nurseryId } });
};

export const getNursery: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await userRepository.findOne({ where: { id: userId } });
  if (currentUser && currentUser.role != "Admin") {
    reply.unauthorized("You can't access to this data.");
    return;
  }

  const nurserys =  await userRepository.createQueryBuilder().where("role IN(:...roles)", { roles: ["Admin", "Nursery"] }).getMany();
  let assignedNurs = [];
  for (let i = 0; i< nurserys.length; i++) {
    if(nurserys[i].nurseryId === currentUser?.nurseryId && nurserys[i].id !== userId) assignedNurs.push(nurserys[i]);
  }
  return assignedNurs;
};

interface UpdateParent {
  id: MultipartValue<string>;
  name: MultipartValue<string>;
  email: MultipartValue<string>;
  address: MultipartValue;
  mobile: MultipartValue<string>;
  photo?: MultipartFile;
  password?: MultipartValue<string>;
}

export const updateParent: RouteHandlerMethod = async (request, reply) => {
  const {
    photo,
    password,
    id: { value: id },
    email: { value: email },
    name: { value: name },
    address: { value: address },
    mobile: { value: mobile },
  } = <UpdateParent>request.body;

  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: parseInt(id) } });
  // console.log(user.id);
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  let path = user.photo;

  if (photo) {
    const buffer = await photo.toBuffer();

    path = `uploads/images/avatars/${randomUUID() + "_" + photo.filename}`;

    fs.appendFileSync(`storage/${path}`, buffer);

    path = "assets/" + path;
  }
  let hashpass = user.password;
  if(password) {
    hashpass = await request.server.bcrypt.hash(password.value);
  }
  const updated = await userRepository.save({
    id: user.id,
    photo: path,
    email,
    name,
    address: JSON.parse(address as string),
    mobile,
    password: hashpass,
  });

  reply.send(updated);
};

export const updateParentPassword: RouteHandlerMethod = async (request, reply) => {

  const { id, password } = <{ id: number; password: string }>request.body;

  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: id } });
  
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  let hashpass = await request.server.bcrypt.hash(password);

  const updated = await userRepository.save({
    id: user.id,
    password: hashpass,
  });

  reply.send(updated);
};

export const deleteParent: RouteHandlerMethod = async (request, reply) => {

  const { id } = <{ id: number; }>request.body;

  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: id } });
  
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  const updated = await userRepository.delete(id);

  reply.send(updated);
};

interface UpdateChild {
  id: MultipartValue<string>;
  name: MultipartValue<string>;
  fname: MultipartValue<string>;
  lname: MultipartValue<string>;
  DOB: MultipartValue<string>;
  gender: MultipartValue<string>;
  additionals: MultipartValue;
  address: MultipartValue<string>;
  photo?: MultipartFile;
  parentId: MultipartValue<string>;
  classroomId: MultipartValue<string>;
  fname1: MultipartValue<string>;
  fname2: MultipartValue<string>;
  fname3: MultipartValue<string>;
  lname1: MultipartValue<string>;
  lname2: MultipartValue<string>;
  lname3: MultipartValue<string>;
  email1: MultipartValue<string>;
  email2: MultipartValue<string>;
  email3: MultipartValue<string>;
  mobile1: MultipartValue<string>;
  mobile2: MultipartValue<string>;
  mobile3: MultipartValue<string>;

}

export const updateChild: RouteHandlerMethod = async (request, reply) => {
  const {
    photo,
    id: { value: id },
    gender: { value: gender },
    name: { value: name },
    fname: { value: fname },
    lname: { value: lname },
    DOB: { value: DOB },
    additionals: { value: additionals },
    address: { value: address },
    parentId: { value: parentId },
    classroomId: { value: classroomId },
    fname1: {value: fname1},
    fname2: {value: fname2},
    fname3: {value: fname3},
    lname1: {value: lname1},
    lname2: {value: lname2},
    lname3: {value: lname3},
    email1: {value: email1},
    email2: {value: email2},
    email3: {value: email3},
    mobile1: {value: mobile1},
    mobile2: {value: mobile2},
    mobile3: {value: mobile3},
  } = <UpdateChild>request.body;

  const childRepository = request.server.db.getRepository(Child);
  const child = await childRepository.findOne({ where: { id: parseInt(id) } });
  // console.log(user.id);
  if (!child) {
    reply.badRequest("Something went wrong");
    return;
  }

  let path = child.photo;

  if (photo) {
    const buffer = await photo.toBuffer();

    path = `uploads/images/avatars/${randomUUID() + "_" + photo.filename}`;

    fs.appendFileSync(`storage/${path}`, buffer);

    path = "assets/" + path;
  }

  const updated = await childRepository.save({
    id: child.id,
    photo: path,
    gender,
    name,
    fname,
    lname,
    DOB,
    additionals: JSON.parse(additionals as string),
    address,
    parentId: parseInt(parentId),
    classroomId: parseInt(classroomId),
    father_fname: fname1,
    father_lname: lname1,
    father_email: email1,
    father_mobile: mobile1,
    mother_fname: fname2,
    mother_lname: lname2,
    mother_email: email2,
    mother_mobile: mobile2,
    third_fname: fname3,
    third_lname: lname3,
    third_email: email3,
    third_mobile: mobile3,
  });

  reply.send(updated);
};

interface UpdateNursery {
  id: MultipartValue<string>;
  name: MultipartValue<string>;
  fname: MultipartValue<string>;
  lname: MultipartValue<string>;
  DOB: MultipartValue<string>;
  email: MultipartValue<string>;
  address: MultipartValue;
  mobile: MultipartValue<string>;
  classroomId: MultipartValue<string>;
  password?: MultipartValue<string>;
}

export const updateNursery: RouteHandlerMethod = async (request, reply) => {
  const {
    password,
    id: { value: id },
    email: { value: email },
    name: { value: name },
    fname: { value: fname },
    lname: { value: lname },
    DOB: { value: DOB },
    address: { value: address },
    mobile: { value: mobile },
    classroomId: { value: classroomId },
  } = <UpdateNursery>request.body;

  const userRepository = request.server.db.getRepository(User);
  const user = await userRepository.findOne({ where: { id: parseInt(id) } });
  // console.log(user.id);
  if (!user) {
    reply.unauthorized("unauthorized");
    return;
  }

  let hashpass = user.password;
  if(password) {
    hashpass = await request.server.bcrypt.hash(password.value);
  }
  const updated = await userRepository.save({
    id: user.id,
    email,
    name,
    fname,
    lname,
    DOB,
    classroomId: parseInt(classroomId),
    address: JSON.parse(address as string),
    mobile,
    password: hashpass,
  });

  reply.send(updated);
};


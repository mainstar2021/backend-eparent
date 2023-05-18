import { User } from "@entity/User";
import { RouteHandlerMethod } from "fastify";
// import { Any } from "typeorm";

export const index: RouteHandlerMethod = async (request, reply) => {
  const userId = request.user.id;
  const userRepository = request.server.db.getRepository(User);
  const currentUser = await request.server.db.manager.findOne(User, { where: { id: userId } });

  console.log(currentUser?.role);

  if (currentUser?.role === "Admin") {

    const imagesList = await userRepository
      .createQueryBuilder("user")
      .leftJoin("user.children", "children")
      .leftJoin("children.events", "events")
      .select("events.images", "images")
      .where("user.nurseryId = :id", { id: currentUser.nurseryId })
      .getRawMany();

      return imagesList.reduce((acc, cur) => {
        if (!cur.images) return acc;
  
        let img_arr = cur.images.split(",");
        var new_arr:Object[] = [];
  
        img_arr.forEach(function(item: Object){  
          new_arr.push({'child_name': cur.child_name, 'image': item, 'child_id': cur.child_id})  
        });
  
        return [...acc, ...new_arr];
      }, []);
  }

  if (currentUser?.role === "Nursery") {

    const imagesList = await userRepository
      .createQueryBuilder("user")
      .leftJoin("user.children", "children")
      .leftJoin("children.events", "events")
      .select(["events.images as images", "children.name as child_name", "events.childId as child_id"])
      .where("user.nurseryId = :id", { id: currentUser.nurseryId })
      .andWhere("children.classroomId = :classroomId", { classroomId: currentUser.classroomId })
      .getRawMany();

    return imagesList.reduce((acc, cur) => {
      if (!cur.images) return acc;

      let img_arr = cur.images.split(",");
      var new_arr:Object[] = [];

      img_arr.forEach(function(item: Object){  
        new_arr.push({'child_name': cur.child_name, 'image': item, 'child_id': cur.child_id})  
      });

      return [...acc, ...new_arr];
    }, []);
  }

  const imagesList = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.children", "children")
    .leftJoin("children.events", "events")
    .select("events.images", "images")
    // .where("events.posterId = :id", { id: userId })
    .where("children.parentId = :id", {id: currentUser?.id})
    .getRawMany();
    return imagesList.reduce((acc, cur) => {
      if (!cur.images) return acc;

      let img_arr = cur.images.split(",");
      var new_arr:Object[] = [];

      img_arr.forEach(function(item: Object){  
        new_arr.push({'child_name': cur.child_name, 'image': item, 'child_id': cur.child_id})  
      });

      return [...acc, ...new_arr];
    }, []);
};

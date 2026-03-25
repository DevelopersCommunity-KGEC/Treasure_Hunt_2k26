import { z } from "zod";
import { teamSchema } from "./user.validation";

export const TeamResponseSchema_T = teamSchema.extend({
    __id : z.string(),
    createdAt : z.string(),
    updatedAt : z.string(),
    __v : z.number(),
})
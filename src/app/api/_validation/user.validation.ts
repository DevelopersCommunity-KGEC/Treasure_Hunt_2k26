import { z } from "zod";

export const memberSchema = z.object({
    name: z.string(),
    espektroId : z.string(),
})

export const teamSchema = z.object({
    teamName : z.string(),
    teamId: z.string(),
    numberOfLives: z.number(),
    progressString : z.string(),
    validationString : z.string(),
    currentQuestionStage: z.number(),
    isDisqualified : z.boolean(),
    teamMembers : z.array(memberSchema)
})

export const LoginSchema = z.object(({
    teamId : z.string(),
}))
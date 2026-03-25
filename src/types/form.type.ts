import {z} from 'zod';

const UserLoginForm = z.object({
    teamId: z.string(),
})


export const FormType = {
    UserLoginForm
}
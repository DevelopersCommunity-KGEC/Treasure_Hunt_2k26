import { ZodError } from 'zod';
import { toast } from 'sonner';

export const handleZodError = (error: ZodError) => {
    console.log("ZodError",error)
    error.issues.forEach((issue) => toast.error(issue.message,{
        duration: 800
    }));
};
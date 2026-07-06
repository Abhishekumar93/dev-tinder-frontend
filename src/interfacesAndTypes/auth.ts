import { z } from 'zod';
import type { loginSchema } from '../SchemaValidation';

export type LoginForm = z.infer<typeof loginSchema>;

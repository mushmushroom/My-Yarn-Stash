import { z } from 'zod';

export const projectSchemaBase = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  skeins: z.array(
    z.object({
      skein_id: z.number().positive('Please select a skein'),
      weight_required: z.number({ error: 'Required' }).positive('Must be positive'),
    }),
  ),
});

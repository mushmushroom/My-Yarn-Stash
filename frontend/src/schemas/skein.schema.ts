import { z } from 'zod';

export const skeinSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand_id: z.number().nullable().optional(),
  color: z.string().min(1, 'Color is required'),
  weight: z.number({ error: 'Required' }).positive('Must be positive'),
  yardage: z.string().min(1, 'Yardage is required'),
  yardage_unit: z.string().min(1, 'Yardage unit is required'),
  fibers: z.array(z.string()).nullish(),
  comment: z.string().nullish(),
});

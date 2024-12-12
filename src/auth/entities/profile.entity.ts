import { z } from 'zod';


export const profileSchema = z.object({
  id: z.string().min(1),
  avatarUrl: z.string().nullable(),
  phone: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  balance: z.number().default(0)
});


// export class ProfileEntity
//   extends createZodDto(profileSchema)
//   implements Profile {
//   @ApiProperty()
//   id!: string;
//   @ApiProperty({ nullable: true })
//   avatarUrl!: string | null;
//   @ApiProperty({ nullable: true })
//   phone!: string | null;
//   @ApiProperty({ nullable: true })
//   firstName!: string | null;
//   @ApiProperty({ nullable: true })
//   lastName!: string | null;

// }
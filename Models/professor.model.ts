// Base interface for a professor
export interface IProfessorBase {
    name: string;              // Full name of the professor
    department: string;        // Professor's department
    bio: string;               // Short biography of the professor
    calendlyLink: string;      // Calendly link for scheduling appointments
    email: string;             // Unique professor email for identification
    googleMeetEnabled?: string; // Whether Google Meet is enabled (default: true)
  }
  
  // Full interface for a professor including ID
  export interface IProfessor extends IProfessorBase {
    id: number; // Unique identifier for each professor
  }
  
  import { z } from "zod";

// Zod schema for the base professor interface
export const ProfessorBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),           // Full name of the professor
  department: z.string().min(1, "Department is required"),// Professor's department
  bio: z.string().min(1, "Bio is required"),              // Short biography
  calendlyLink: z.string().url("Invalid Calendly URL"),   // Calendly link for scheduling appointments
  email: z.string().email("Invalid email format"),        // Professor's email
  googleMeetEnabled: z.boolean().optional().default(true) // Optional Google Meet setting, defaults to true
});

// Zod schema for the full professor interface with ID
export const ProfessorSchema = ProfessorBaseSchema.extend({
  id: z.number().positive(), // Unique professor ID, must be a positive number
});


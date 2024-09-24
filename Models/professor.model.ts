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
  
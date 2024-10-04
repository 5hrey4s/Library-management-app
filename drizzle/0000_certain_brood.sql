CREATE TABLE IF NOT EXISTS "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"professorId" integer NOT NULL,
	"userId" varchar(255) NOT NULL,
	"appointmentDate" varchar(100) NOT NULL,
	"googleMeetLink" varchar(255),
	"calendlyLink" varchar(255) NOT NULL,
	"createdAt" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"author" varchar(100) NOT NULL,
	"publisher" varchar(100) NOT NULL,
	"genre" varchar(100) NOT NULL,
	"isbnNo" varchar(13) NOT NULL,
	"numOfPages" integer NOT NULL,
	"totalNumOfCopies" integer NOT NULL,
	"availableNumberOfCopies" integer NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"rating" integer NOT NULL,
	CONSTRAINT "books_isbnNo_unique" UNIQUE("isbnNo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phoneNumber" varchar(10) NOT NULL,
	"password" varchar(150) NOT NULL,
	"refreshToken" varchar(255),
	"accessToken" varchar(255),
	"user_id" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"professorId" integer NOT NULL,
	"userId" integer NOT NULL,
	"orderId" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"paymentStatus" varchar(50) NOT NULL,
	"PaymentId" varchar(255) NOT NULL,
	"createdAt" varchar(100) NOT NULL,
	CONSTRAINT "payments_orderId_unique" UNIQUE("orderId"),
	CONSTRAINT "payments_PaymentId_unique" UNIQUE("PaymentId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"department" varchar(100) NOT NULL,
	"bio" text NOT NULL,
	"calendlyLink" varchar(255) NOT NULL,
	"email" varchar(100) NOT NULL,
	"googleMeetEnabled" varchar(10) DEFAULT 'true' NOT NULL,
	CONSTRAINT "professors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"created_at" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"status" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"issueDate" varchar(100) NOT NULL,
	"dueDate" varchar(100) NOT NULL,
	"returnDate" varchar(100),
	"Status" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"addedAt" varchar(100)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professorId_professors_id_fk" FOREIGN KEY ("professorId") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_professorId_professors_id_fk" FOREIGN KEY ("professorId") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_members_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ratings" ADD CONSTRAINT "ratings_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

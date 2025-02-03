import { object, string } from "valibot"
import { createSubjects } from "@openauthjs/openauth/subject"

export const subjects = createSubjects({
	user: object({
		id: string(),
	}),
})

export interface User {
	id: string,
	firstName: string,
	lastName: string,
	email: string,
	isSetUp: number
}
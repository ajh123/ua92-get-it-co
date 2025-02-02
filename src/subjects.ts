import { object, string, number, boolean } from "valibot"
import { createSubjects } from "@openauthjs/openauth/subject"

export const subjects = createSubjects({
	user: object({
		id: number(),
		firstName: string(),
		lastName: string(),
		email: string(),
		isSetUp: boolean(),
	}),
})
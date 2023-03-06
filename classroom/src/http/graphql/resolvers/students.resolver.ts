import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizationGuard } from "src/http/auth/authorization.guard";
import { EnrollmentsService } from "src/http/services/enrollments.service";
import { StudentsService } from "src/http/services/students.service";
import { Student } from "../models/student";

@Resolver(() => Student)
export class StudentsResolver {
  constructor(private studentsService: StudentsService, private enrollmentsService: EnrollmentsService) { }

  // @UseGuards(AuthorizationGuard)
  // @Query(() => Student)
  // me(@CurrentUser() user: AuthUser) {
  //   return this.studentsService.getStudentByAuthUserId(user.sub);
  // }


  @Query(() => [Student])
  @UseGuards(AuthorizationGuard)
  students() {
    return this.studentsService.listAllStudents()
  }

  @ResolveField()
  enrollments(@Parent() student: Student) {
    return this.enrollmentsService.listAllEnrollmentsByStundent(student.id)
  }

}
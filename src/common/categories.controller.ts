import { Controller, Get } from "@nestjs/common";
import { CATEGORIES } from "../common/categories";

@Controller("categories")
export class CategoriesController {

  @Get()
  getCategories() {
    return CATEGORIES;
  }

}

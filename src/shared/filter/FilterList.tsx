import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../model/category/category-model";
import { ApiResponse } from "../../model/schema/base_schema";
const CATEGORY_URL = "/api/category";

function FilterList(props: any) {
  const [addForum, setAddForum] = useState({ ...props.data });
  console.log("masuk apa", props);

  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const eduOptions: eduOption[] = [
    { eduLevel: "Education Level", label: "Education Level" },
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];

  const [categorySelected, setCategorySelected] = useState("Subject");
  const [selectedEdu, setSelectedEdu] = useState<string>("");

  const handleChangeEdu = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddForum({ ...props, question_category: event.target.value });
    console.log("coba cek isinya", props.data);
  };

  const handleChangeSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddForum({ ...props, question_level: event.target.value });
  };

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get<ApiResponse<CategorySchema>>(
        CATEGORY_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setCategories(transfromToCategoryListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  function onFilterValueChanged() {}

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="d-flex col justify-content-end" style={{gap:"0.5rem", marginTop:"0.25rem"}}>
      <select className="filtering" onChange={handleChangeSubject}>
        <option value="">Subject</option>
        {categories.categories.map((data) => {
          return (
            <>
              <option value="">{data.categoryName}</option>
            </>
          );
        })}
      </select>
      <div>
        <select className="filtering" id="" value={selectedEdu} onChange={handleChangeEdu}>
          {eduOptions.map((option) => (
            <option key={option.eduLevel} value={option.eduLevel}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterList;

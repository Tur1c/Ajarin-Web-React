import { returnPaginationRange } from "../../utils/appUtils";

function Pagination(props: {
  totalClass: number;
  classPerPage: number;
  onPageChange: (arg0: number | string) => void;
  currentPage: number;
}) {
  let array = returnPaginationRange(
    Math.ceil(props.totalClass / props.classPerPage),
    props.currentPage,
    props.classPerPage,
    1
  );

  return (
    <ul className="pagination pagination-md justify-content-center">
      <li className="page-item">
        <span
          className="page-link"
          onClick={() => props.onPageChange("&laquo;")}
        >
          &laquo;
        </span>
      </li>
      <li className="page-item">
        <span
          className="page-link"
          onClick={() => props.onPageChange("&lsaquo;")}
        >
          &lsaquo;
        </span>
      </li>
      {array.map((value: string | number, index) => {
        if (value === props.currentPage) {
          return (
            <li className="page-item active" key={index}>
              <span
                className="page-link"
                onClick={() => props.onPageChange(value)}
              >
                {value}
              </span>
            </li>
          );
        } else {
          return (
            <li className="page-item" key={index}>
              <span
                className="page-link"
                onClick={() => props.onPageChange(value)}
              >
                {value}
              </span>
            </li>
          );
        }
      })}
      <li className="page-item">
        <span
          className="page-link"
          onClick={() => props.onPageChange("&rsaquo;")}
        >
          &rsaquo;
        </span>
      </li>
      <li className="page-item">
        <span
          className="page-link"
          onClick={() => props.onPageChange("&raquo;")}
        >
          &raquo;
        </span>
      </li>
    </ul>
  );
}

export default Pagination;

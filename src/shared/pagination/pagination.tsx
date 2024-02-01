import "./pagination.css";

function Pagination(props: {
  totalClass: number;
  classPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}) {
  let pages = [];

  for (let i = 1; i <= Math.ceil(props.totalClass / props.classPerPage); i++) {
    pages.push(i);
  }
  return (
    <div className="pagination">
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => props.setCurrentPage(page)}
            className={page === props.currentPage ? "active" : ""}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}

export default Pagination;

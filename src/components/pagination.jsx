import React from "react";
import { TablePagination } from "@mui/material";

const Pagination = ({ totalCount, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) => {
  return (
    <TablePagination
      component="div"
      count={totalCount} // Total number of items
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
};

export default Pagination;

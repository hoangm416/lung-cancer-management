import React, { createContext, useContext, useState } from "react";

type TableContextType = {
  data: Record<string, any>[];
  setData: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  columns: { accessorKey: string; header: string }[];
  setColumns: React.Dispatch<React.SetStateAction<{ accessorKey: string; header: string }[]>>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<{ accessorKey: string; header: string }[]>([]);

  return (
    <TableContext.Provider value={{ data, setData, columns, setColumns }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};
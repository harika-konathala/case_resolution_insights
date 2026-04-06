import React from "react";

interface CSVLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  data: any[];
  filename?: string;
  headers?: any[];
}

export const CSVLink = React.forwardRef<HTMLAnchorElement, CSVLinkProps>(
  ({ data, filename = "export.csv", headers, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e);
      }
      
      try {
        const rows = data;
        if (!rows || !rows.length) return;
        
        let keys = headers ? headers.map(h => typeof h === 'string' ? h : h.key) : Object.keys(rows[0]);
        
        const csvContent = [
          keys.join(","),
          ...rows.map(row => 
            keys.map(k => {
              let val = row[k];
              if (val === null || val === undefined) return "";
              if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
              return val;
            }).join(",")
          )
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } catch (err) {
        console.error("Error generating CSV:", err);
      }
    };

    return (
      <a
        ref={ref}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleClick(e);
        }}
        {...props}
      />
    );
  }
);

CSVLink.displayName = "CSVLink";

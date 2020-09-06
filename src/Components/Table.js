import React from 'react'
import numeral from "numeral";
import "./Table.css"

function Table({tableData}) {
  // console.log(tableData)
    return (
        <div className="table">
         {tableData.map((tp) =>(
           <tr>
           <td>{tp.country}</td>
           <td>
             <strong>{numeral(tp.cases).format("0,0")}</strong>
           </td>
         </tr>
     
         ))}   
        
        </div>
    )
}

export default Table

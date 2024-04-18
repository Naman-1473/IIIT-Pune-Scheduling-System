import React, { useEffect, useState } from 'react'
import {getDepartmentAPI,deleteDepartmentAPI} from "../../utils/constants.js"
import Cookies from 'js-cookie'
import DepartmentForm from './DepartmentForm.jsx'
const Department = () => {
  const [isChanged,setisChanged] = useState(false)
  const [DepartmentData,setDepartmentData] = useState([])
  const handleDelete = async (id)=>{
    try{
      const accessToken = Cookies.get('accessToken');
      const response = await fetch(deleteDepartmentAPI,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${accessToken}`
          },
          body: JSON.stringify({departmentId:id})
      });
      if(!response.ok){
          throw new Error('Network response was not ok');
      }else{
          const responseData = await response.json();
          console.log(responseData)
          setisChanged(prev => !prev)
      }
    }
    catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
  }
//   const handleUpdate = async (data)=>{
//     console.log(data)
//       try{
//         const accessToken = Cookies.get('accessToken');
//         const response = await fetch(updateDepartmentAPI,{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization':`Bearer ${accessToken}`
//             },
//             body: JSON.stringify(data)
//         });
//         if(!response.ok){
//             throw new Error('Network response was not ok');
//         }else{
//             const responseData = await response.json();
//             console.log(responseData)
//             setisChanged(prev => !prev)
//         }
//       }
//       catch (error) {
//           console.error('There was a problem with your fetch operation:', error);
//       }
//   }
  useEffect(()=>{
      const getData =async ()=>{
        try{
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(getDepartmentAPI,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${accessToken}`
                },
            });
            if(!response.ok){
                throw new Error('Network response was not ok');
            }else{
                const responseData = await response.json();
                console.log(responseData)
                setDepartmentData(responseData.data)
            }
        }
        catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
      }
      getData()
  },[isChanged])
  return (
    <div className='flex h-5/6 justify-center items-center'>
        <div className='h-5/6 w-4/6'>
            {   
                DepartmentData?.map((Department)=>{
                    return(
                       <DepartmentForm key={Department._id}
                       Department={Department} handleDelete={handleDelete}/> 
                    )
                })
            }
        </div>
    </div>
  )
}
export default Department;

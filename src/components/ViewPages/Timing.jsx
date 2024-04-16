import React ,{useEffect,useState} from 'react'
import {getTimingAPI,updateTimingAPI,deleteTimingAPI} from "../../utils/constants.js"
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import TimingForm from './TimingForm.jsx'
const Timing = () => {
  const [isChanged,setisChanged] = useState(false)
  const [TimingData,setTimingData] = useState([])
  const handleDelete = async (id)=>{
    try{
      const accessToken = Cookies.get('accessToken');
      const response = await fetch(deleteTimingAPI,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${accessToken}`
          },
          body: JSON.stringify({startTime:id})
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
//       try{
//         const accessToken = Cookies.get('accessToken');
//         const response = await fetch(updateTimingAPI,{
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
          const response = await fetch(getTimingAPI,{
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
              setTimingData(responseData.data)
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
                TimingData?.map((Timing)=>{
                    return(
                       <TimingForm key={Timing._id} Timing={Timing} handleDelete={handleDelete}/> 
                    )
                })
            }
        </div>
    </div>
  )
}
export default Timing

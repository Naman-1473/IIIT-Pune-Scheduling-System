import React ,{useEffect,useState} from 'react'
import {getSectionAPI,updateSectionAPI,deleteSectionAPI} from "../../utils/constants.js"
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import SectionForm from './SectionForm.jsx'
const Section = () => {
  const [isChanged,setisChanged] = useState(false)
  const [SectionData,setSectionData] = useState([])
  const handleDelete = async (id)=>{
    try{
      const accessToken = Cookies.get('accessToken');
      const response = await fetch(deleteSectionAPI,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${accessToken}`
          },
          body: JSON.stringify({sectionId:id})
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
  const handleUpdate = async (data)=>{
      try{
        const accessToken = Cookies.get('accessToken');
        const response = await fetch(updateSectionAPI,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
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
  useEffect(()=>{
    const getData =async ()=>{
      try{
          const accessToken = Cookies.get('accessToken');
          const response = await fetch(getSectionAPI,{
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
              setSectionData(responseData.data)
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
                SectionData?.map((Section)=>{
                    return(
                       <SectionForm key={Section._id} Section={Section} handleDelete={handleDelete} handleUpdate={handleUpdate}/> 
                    )
                })
            }
        </div>
    </div>
  )
}
export default Section

import React, { useEffect, useState } from 'react'
import {getCourseAPI,updateCourseAPI,deleteCourseAPI} from "../../utils/constants.js"
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import CourseForm from './CourseForm.jsx'
const Course = () => {
// const form = useForm()
// const {register,handleSubmit ,formState} = form
// const {errors} = formState
  const [isChanged,setisChanged] = useState(false)
  const [courseData,setCourseData] = useState([])
  const handleDelete = async (id)=>{
    try{
      const accessToken = Cookies.get('accessToken');
      const response = await fetch(deleteCourseAPI,{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${accessToken}`
          },
          body: JSON.stringify({courseId:id})
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
    console.log(data)
      try{
        const accessToken = Cookies.get('accessToken');
        const response = await fetch(updateCourseAPI,{
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
            const response = await fetch(getCourseAPI,{
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
                setCourseData(responseData.data)
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
                courseData?.map((course)=>{
                    return(
                       <CourseForm key={course._id}
                       course={course} handleDelete={handleDelete} handleUpdate={handleUpdate}/> 
                    )
                })
            }
        </div>
    </div>
  )
}
export default Course;

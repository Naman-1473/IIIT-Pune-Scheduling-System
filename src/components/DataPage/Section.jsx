import { addSectionAPI } from "../../utils/constants";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"
import { useEffect } from "react";
// React hook form keeps track of the values entered , if an input has changed or been interacted with.
// It does that without rerendering the component.
const Section = () => {
    const form = useForm({
        defaultValues:{
            sectionId:"",
            capacity:"",
        }
    })
    // register method tracks the formstate of the input we attach it with
    const {register,handleSubmit ,formState ,reset} = form
    const {errors,isSubmitting,isSubmitSuccessful} = formState
    useEffect(()=>{
        if(isSubmitSuccessful) reset()
    },[isSubmitSuccessful])
    const handler= async (data)=>{
        console.log("form data",data)
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(addSectionAPI, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                const responseData = await response.json();
                console.log(responseData)
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    }
  return (
        <div className="bg-white text-center p-4 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Enter Section Data</h1>
            <form onSubmit={handleSubmit(handler)} noValidate>
                <div className="mb-4">
                    <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-1">Section ID</label>
                    <input type="text" id="sectionId"
                     {...register("sectionId",{
                        required:{
                            value:true,
                            message:'Section Id is required',
                        },
                     })}
                     className="w-full py-2 px-4 border rounded-lg" />
                     <p>{errors.sectionId?.message}</p>
                </div>
                <div className="mb-4">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Section strength</label>
                    <input type="number" id="capacity"
                    {...register("capacity",{
                        // TYPE is first done then validation
                        // valueAsNumber:true,
                        required:{
                            value:true,
                            message:'Section strength is required',
                        },
                        // can also add multiple validation as an object of functions
                        validate: (fieldValue)=>{
                            // returns true if validation is passed
                            // else return the message
                            return (
                                fieldValue < 1000 || "Too large"
                            );
                        }
                     })
                    } 
                    className="w-full py-2 px-4 border rounded-lg" />
                    <p>{errors.capacity?.message}</p>
                </div>
                <button disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                    SUBMIT
                </button>
            </form>
        </div>
  )
}

export default Section

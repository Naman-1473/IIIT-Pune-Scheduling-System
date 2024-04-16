import { addTimingAPI } from "../../utils/constants";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"
import { useEffect } from "react";
const Timings = () => {
    const form = useForm({
        defaultValues:{
            startTime:"",
            endTime:"",
        }
    })
    const {register,handleSubmit ,formState ,reset} = form
    const {errors,isSubmitting,isSubmitSuccessful} = formState
    useEffect(()=>{
        if(isSubmitSuccessful) reset()
    },[isSubmitSuccessful])
    const handler=async (data)=>{
        console.log("Timings data",data)
        try {
            const accessToken = Cookies.get('accessToken');
            const response = await fetch(addTimingAPI, {
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
    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const time = `${formattedHour}:${formattedMinute}`;
                options.push(
                    <option key={time} value={time}>
                        {time}
                    </option>
                );
            }
        }
        return options;
    };
    return (
          <div className="bg-white text-center p-4 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Enter New Timings</h1>
              <form onSubmit={handleSubmit(handler)} noValidate> 
                    <div className="mb-4">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input 
                            id="startTime"
                            type="time" 
                            {...register("startTime",{
                                required:{
                                    value:true,
                                    message:'Start Time is required',
                                },
                             })}
                            className="w-full py-2 px-4 border rounded-lg" 
                        />
                        <p>{errors.startTime?.message}</p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input 
                            id="endTime"
                            type="time" 
                            {...register("endTime",{
                                required:{
                                    value:true,
                                    message:'End Time is required',
                                },
                             })} 
                            className="w-full py-2 px-4 border rounded-lg" 
                        />
                        <p>{errors.endTime?.message}</p>
                    </div>
                    <div className="mb-4">
                    <select>
                        <option value="">Select Time</option>
                        {generateTimeOptions()}
                    </select>
                    </div>
                  <button disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                      SUBMIT
                  </button>
              </form>
          </div>
    )
}
export default Timings

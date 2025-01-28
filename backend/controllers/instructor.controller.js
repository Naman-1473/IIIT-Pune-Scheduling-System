import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Instructor} from "../models/instructor.model.js";


const setinstructor = asyncHandler( async ( req, res ) =>
{
    const {instructorName} = req.body
    // console.log( req.body )
    if ( instructorName.trim() === '' )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedInstructor = await Instructor.findOne( {instructorName} )
    if ( existedInstructor )
    {
        throw new ApiError( 409, "Instructor already exist" )
    }
    const instructor = await Instructor.create( {
        instructorName
    } )
    const createdInstructor = await Instructor.findById( instructor._id )
    // console.log(createdInstructor)
    if ( !createdInstructor )
    {
        throw new ApiError( 500, "Something went wrong while registering" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdInstructor, "Instructor Registered" )
    )
} )

export
{
    setinstructor
}
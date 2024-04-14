import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Section } from "../models/section.model.js";


const setSection = asyncHandler( async ( req, res ) =>
{
    const {sectionId, capacity} = req.body
    if ( [ sectionId, capacity ].some( ( field ) => field?.trim() === '' ) )
    {
        throw new ApiError( 400, "All fields required" )
    }

    const existedSection = await Section.findOne( {sectionId} )
    if ( existedSection )
    {
        throw new ApiError( 409, "Section already exist" )
    }
    const section = await Section.create( {
        capacity, sectionId
    } )
    const createdSection = await Section.findById( section._id )
    // console.log(createdSection)
    if ( !createdSection )
    {
        throw new ApiError( 500, "Something went wrong while registering section" )
    }

    return res.status( 201 ).json(
        new ApiResponse( 200, createdSection, "Section Registered" )
    )
} )

export
{
    setSection
}
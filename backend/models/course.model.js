import mongoose, {Schema} from 'mongoose'

const courseSchema = new Schema( {
    name: {
        type: String,
        required: true,
        index: true,
    },
    courseId: {
        type: String,
        required: true,
        unique: true,
    },
    instructor:{
        type:Schema.Types.ObjectId,
        ref:'Instructor',
        required:true
    }
}, {timestamps: true} )


export const Course = mongoose.model( "Course", courseSchema )
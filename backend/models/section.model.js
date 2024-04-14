import mongoose, {Schema} from 'mongoose'

const sectionSchema = new Schema( {
    capacity: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    sectionId: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true} )


export const Section = mongoose.model( "Section", sectionSchema )
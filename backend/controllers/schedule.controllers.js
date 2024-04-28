import {asyncHandler} from '../utils/asyncHandler.js'
import {Course} from "../models/course.model.js"
import {Department} from "../models/department.model.js"
import {Instructor} from "../models/instructor.model.js"
import {Meeting} from "../models/meeting.model.js"
import {Room} from "../models/room.model.js"
import {Section} from "../models/section.model.js"
import {ApiResponse} from '../utils/ApiResponse.js'

const getSchedule = asyncHandler( async ( req, res ) =>
{

    const POPULATION_SIZE = 9
    const NUMB_OF_ELITE_SCHEDULES = 1
    const TOURNAMENT_SELECTION_SIZE = 3
    let MUTATION_RATE = 0.05
    class Data
    {
        constructor ()
        {
            this._rooms = []; // This will be populated with MongoDB query results
            this._meetingTimes = []; // This will be populated with MongoDB query results
            this._instructors = []; // This will be populated with MongoDB query results
            this._courses = []; // This will be populated with MongoDB query results
            this._depts = []; // This will be populated with MongoDB query results
            this._sections = [];
        }

        async fetchData ()
        {
            // MongoDB queries here to fetch data
            try
            {
                this._rooms = await Room.find();
                this._courses = await Course.find();
                this._depts = await Department.find();
                this._instructors = await Instructor.find();
                this._meetingTimes = await Meeting.find();
                this._sections = await Section.find();
            } catch ( error )
            {
                console.error( 'Error fetching data:', error );
                throw new Error( 'Failed to fetch data from MongoDB' );
            }
        }

        get_sections ()
        {
            return this._sections;
        }

        get_rooms ()
        {
            return this._rooms;
        }

        get_instructors ()
        {
            return this._instructors;
        }

        get_courses ()
        {
            return this._courses;
        }

        get_depts ()
        {
            return this._depts;
        }

        get_meetingTimes ()
        {
            return this._meetingTimes;
        }
    }

    class Schedule
    {
        // Constructor for the Schedule class
        constructor ()
        {
            // Initialize instance variables
            this._classes = []; // Array to store classes
            this._numberOfConflicts = 0; // Number of conflicts in the schedule
            this._fitness = -1; // Fitness score of the schedule initially set to -1 to indicate no fitness has been calculated
            this._classNumb = 0; // Counter for class numbers
            this._isFitnessChanged = true; // Flag to track if fitness has changed
        }

        // Getter method for classes
        getClasses ()
        {
            // If fitness has changed, indicate that fitness needs to be recalculated
            this._isFitnessChanged = true;
            // Return the array of classes
            return this._classes;
        }

        // Getter method for the number of conflicts
        get_numbOfConflicts ()
        {
            // Return the number of conflicts
            return this._numberOfConflicts;
        }

        // Getter method for fitness
        getFitness ()
        {
            // If fitness has changed, recalculate it
            if ( this._isFitnessChanged )
            {
                this._fitness = this.calculate_fitness();
                this._isFitnessChanged = false;
            }
            // Return the fitness score
            return this._fitness;
        }

        // Method to initialize the schedule
        async initialize ()
        {
            // Get all sections from the data
            const sections = data.get_sections();
            // Get all rooms from the data
            const rooms = data.get_rooms();
            // Create a copy of the rooms array to manipulate
            // let availableRooms = [ ...rooms ];
            // Iterate over each section
            for ( const section of sections )
            {
                // Get the department of the section
                const deptId = section.departmentName;
                const dept = await Department.findById( deptId )
                // Get all courses in the department
                const coursesId = dept.courses;
                const room = data._rooms[ 0 ];

                let courses = [];
                try
                {
                    for ( const courseId of coursesId )
                    {
                        const course = await Course.findById( courseId ); // Find course by its ObjectId
                        if ( course )
                        {
                            courses.push( course ); // Push the found course to the courses array
                        } else
                        {
                            console.log( `Course with id ${ courseId } not found` );
                        }
                    }
                } catch ( error )
                {
                    console.error( 'Error retrieving courses:', error );
                }
                for ( const course of courses )
                {
                    for ( let i = 0; i < course.credit; i++ )
                    {
                        const instructor = await Course.findById( course._id ).populate( 'instructor' );
                        const crs_inst = Array.from( instructor );
                        const newClass = new Class( this._classNumb, dept, section.sectionId, course );
                        this._classNumb++;
                        const meeting = await Meeting.find();
                        newClass.setMeetingTime( data.get_meetingTimes()[ Math.floor( Math.random() * meeting.length ) ] );
                        newClass.setRoom( room );
                        newClass.setInstructor( crs_inst[ Math.floor( Math.random() * crs_inst.length ) ] );
                        this._classes.push( newClass );
                    }
                }
            }
            // Return the initialized schedule
            return this;
        }

        // Method to calculate the fitness of the schedule
        calculate_fitness ()
        {
            // Initialize the conflict count
            let numberOfConflicts = 0;

            // Get the list of classes
            const classes = this.getClasses();

            // Iterate through the classes
            for ( let i = 0; i < classes.length; i++ )
            {
                // Check if room capacity is less than max number of students
                if ( classes[ i ].room.seating_capacity < parseInt( classes[ i ].course.coursecapacity ) )
                {
                    numberOfConflicts++;
                }

                // Compare meeting times and sections
                for ( let j = i + 1; j < classes.length; j++ )
                {
                    if ( classes[ i ].meeting_time === classes[ j ].meeting_time &&
                        classes[ i ].section === classes[ j ].section )
                    {
                        numberOfConflicts++;
                    }

                    // Check for same day, section, and course
                    if ( classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].section === classes[ j ].section &&
                        classes[ i ].course === classes[ j ].course )
                    {
                        numberOfConflicts++;
                    }

                    // Check for same meeting time and instructor
                    if ( classes[ i ].meeting_time === classes[ j ].meeting_time &&
                        classes[ i ].instructor === classes[ j ].instructor )
                    {
                        numberOfConflicts++;
                    }
                }
            }

            // Calculate the conflict score
            const conflictScore = 1 / ( 1.0 * numberOfConflicts + 1 );

            // Return the result
            return conflictScore;

        }

    }

    class Population
    {
        constructor ( size )
        {
            this._size = size;
            this._data = data; // Assuming 'data' is defined elsewhere
            this._schedules = []
        }
        async initializeSchedules ()
        {
            for ( let i = 0; i < this._size; i++ )
            {
                let schedule = new Schedule();
                await schedule.initialize();
                this._schedules.push( schedule );
            }
        }
        get_schedules ()
        {
            return this._schedules;
        }

    }

    class Class
    {
        constructor ( id, dept, section, course )
        {
            this.class_id = id;
            this.department = dept;
            this.course = course;
            // instructor is not an object
            this.instructor = null;
            this.meeting_time = null;
            this.room = null;
            this.section = section;
        }

        getId ()
        {
            return this.class_id;
        }

        getDept ()
        {
            return this.department;
        }

        getCourse ()
        {
            return this.course;
        }

        getInstructor ()
        {
            return this.instructor;
        }

        getMeetingTime ()
        {
            return this.meeting_time;
        }

        getRoom ()
        {
            return this.room;
        }

        setInstructor ( instructor )
        {
            this.instructor = instructor;
        }

        setMeetingTime ( meetingTime )
        {
            this.meeting_time = meetingTime;
        }

        setRoom ( room )
        {
            this.room = room;
        }
    }

    class GeneticAlgorithm
    {
        async evolve ( currentPopulation )
        {
            let newPopulation = await this._crossover_population( currentPopulation );
            newPopulation = await this._mutate_population( newPopulation );
            return newPopulation;
        }
        async _crossover_population ( pop )
        {
            let crossover_pop = new Population( 0 );
            for ( let i = 0; i < NUMB_OF_ELITE_SCHEDULES; i++ )
            {
                crossover_pop.get_schedules().push( pop.get_schedules()[ i ] );
            }
            let i = NUMB_OF_ELITE_SCHEDULES;
            while ( i < POPULATION_SIZE )
            {
                let schedule1 = this._select_tournament_population( pop ).get_schedules()[ 0 ];
                let schedule2 = this._select_tournament_population( pop ).get_schedules()[ 0 ];
                crossover_pop.get_schedules().push( await this._crossover_schedule( schedule1, schedule2 ) );
                i++;
            }
            return crossover_pop;

        }

        _mutate_population ( population )
        {
            for ( let i = NUMB_OF_ELITE_SCHEDULES; i < POPULATION_SIZE; i++ )
            {
                this._mutate_schedule( population.get_schedules()[ i ] );
            }
            return population;
        }


        async _crossover_schedule ( schedule1, schedule2 )
        {
            const crossoverSchedule = await new Schedule().initialize();
            for ( let i = 0; i < crossoverSchedule.getClasses().length; i++ )
            {
                if ( Math.random() > 0.5 )
                {
                    crossoverSchedule.getClasses()[ i ] = schedule1.getClasses()[ i ];
                } else
                {
                    crossoverSchedule.getClasses()[ i ] = schedule2.getClasses()[ i ];
                }
            }
            return crossoverSchedule;
        }


        async _mutate_schedule ( mutateSchedule )
        {

            const schedule = await new Schedule().initialize();
            for ( let i = 0; i < mutateSchedule.getClasses().length; i++ )
            {
                if ( MUTATION_RATE > Math.random() )
                {
                    mutateSchedule.getClasses()[ i ] = schedule.getClasses()[ i ];
                }
            }
            return mutateSchedule;


        }

        _select_tournament_population ( pop )
        {

            const tournament_pop = new Population( 0 );
            let i = 0;
            while ( i < TOURNAMENT_SELECTION_SIZE )
            {
                const randomIndex = Math.floor( Math.random() * POPULATION_SIZE );
                tournament_pop.get_schedules().push( pop.get_schedules()[ randomIndex ] );
                i++;
            }
            tournament_pop.get_schedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            return tournament_pop;


        }
    }


    async function timetable ()
    {
        let schedule = [];
        let population = new Population( POPULATION_SIZE );
        await population.initializeSchedules();
        let generation_num = 0;
        population.get_schedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
        const geneticAlgorithm = new GeneticAlgorithm();
        while ( population.get_schedules()[ 0 ].getFitness() !== 1.0 )
        {
            generation_num++;
            console.log( '\n> Generation #' + generation_num );
            population = await geneticAlgorithm.evolve( population );
            population.get_schedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            schedule = population.get_schedules()[ 0 ].getClasses();
            console.log( population.get_schedules()[ 0 ].getFitness() );
        }

        // Assuming you have a function similar to render in JavaScript to render the timetable.
        // You would replace this with your actual rendering logic.
        // return res.status( 201 ).json(
        //     new ApiResponse(200, {schedule: schedule, sections: await Section.find(), times: await MeetingTime.find()},"Algo completed")
        // ) ;
        return schedule
    }

    const data = new Data();
    await data.fetchData();
    console.log( await timetable() )
} )
export
{
    getSchedule
}
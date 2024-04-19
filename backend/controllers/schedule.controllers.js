import {asyncHandler} from '../utils/asyncHandler.js'
import {Course} from "../models/course.model.js"
import {Department} from "../models/department.model.js"
import {Instructor} from "../models/instructor.model.js"
import {Meeting} from "../models/meeting.model.js"
import {Room} from "../models/room.model.js"
import {Section} from "../models/section.model.js"

const getSchedule = asyncHandler( async ( req, res ) =>
{
    const POPULATION_SIZE = 9
    const NUMB_OF_ELITE_SCHEDULES = 1
    const TOURNAMENT_SELECTION_SIZE = 3
    const MUTATION_RATE = 0.05
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

                let meetings = await Meeting.find();
                const week = [ 'mon', 'tue', 'wed', 'thur', 'fri' ];
                for ( const day of week )
                {
                    for ( let i = 0; i < meetings.length; i++ )
                    {
                        meetings[ i ].day = day;
                    }
                }
                this._meetingTimes = meetings;
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
        constructor ( data )
        {
            // Initialize instance variables
            this._data = data; // Data object containing information about rooms, instructors, courses, etc.
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
        initialize ()
        {
            // Get all sections from the data
            const sections = this._data.get_sections();
            // Get all rooms from the data
            const rooms = this._data.get_rooms();
            // Create a copy of the rooms array to manipulate
            let availableRooms = [ ...rooms ];
            // Iterate over each section
            for ( const section of sections )
            {
                // Get the department of the section
                const dept = section.departmentName;
                // Get all courses in the department
                const courses = dept.courses;
                // Find a room with sufficient capacity for the section
                // also make sure there is no wastage of space
                let minDiff = Infinity;
                let suitableRoomIndex = -1;
                for ( let i = 0; i < availableRooms.length; i++ )
                {
                    const room = availableRooms[ i ];
                    if ( room.capacity >= section.capacity )
                    {
                        const diff = room.capacity - section.capacity;
                        if ( diff < minDiff )
                        {
                            minDiff = diff;
                            suitableRoomIndex = i;
                        }
                    }
                }
                // If no suitable room is found, throw an error
                if ( suitableRoomIndex === -1 )
                {
                    throw new Error( `No room with sufficient capacity for section ${ section.id }` );
                }
                // Get the suitable room
                const room = availableRooms[ suitableRoomIndex ];
                // Remove the room from the available rooms
                availableRooms.splice( suitableRoomIndex, 1 );
                // Iterate over each course
                for ( const course of courses )
                {
                    // Get the credit for the course
                    const credit = course.credit;
                    // Distribute classes evenly among courses
                    for ( let i = 0; i < credit; i++ )
                    {
                        // Create a new class instance
                        const newClass = new Class( this._classNumb, dept, section, course );
                        // Increment class number
                        this._classNumb++;
                        // Set meeting time for the class randomly
                        newClass.setMeetingTime( data.get_meetingTimes()[ Math.floor( Math.random() * this._data.get_meetingTimes().length ) ] );
                        // Set room for the class
                        newClass.setRoom( room );
                        // Set instructor for the class
                        newClass.setInstructor( course.instructorname );
                        // Add the new class to the array of classes
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
            // Reset the number of conflicts
            this._numberOfConflicts = 0;
            // Get all classes in the schedule
            const classes = this.getClasses();
            // Iterate over each class
            for ( let i = 0; i < classes.length; i++ )
            {
                // Iterate over each class again to check for conflicts with other classes
                for ( let j = i; j < classes.length; j++ )
                {
                    // SECTION CONSTRAINTS
                    //  same time same day two courses for a section
                    if ( classes[ i ].meeting_time.startTime === classes[ j ].meeting_time.startTime &&
                        classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].section === classes[ j ].section )
                    {
                        this._numberOfConflicts++;
                    }
                    // one course taught only once to each section in a day
                    if ( classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].section === classes[ j ].section &&
                        classes[ i ].course.name === classes[ j ].course.name )
                    {
                        this._numberOfConflicts++;
                    }

                    // INSTRUCTOR CONSTRAINT
                    // same time same day two sections for an instructor
                    if ( classes[ i ].meeting_time.startTime === classes[ j ].meeting_time.startTime &&
                        classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].instructor === classes[ j ].instructor &&
                        classes[ i ].section.sectionId !== classes[ j ].section.sectionId )
                    {
                        this._numberOfConflicts++;
                    }

                }
            }
            // Calculate the fitness score (inverse of the number of conflicts)
            return 1 / ( 1.0 * ( this._numberOfConflicts + 1 ) );
        }
    }

    class Population
    {
        constructor ( size, data )
        {
            this._size = size;
            this._data = data;
            this._schedules = Array.from( {length: size}, () => new Schedule().initialize() );
        }

        getSchedules ()
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
        evolve ( population )
        {
            return this._mutate_population( this._crossover_population( population ) );
        }

        _crossover_population ( pop )
        {
            const crossoverPop = new Population( 0 );
            for ( let i = 0; i < NUMB_OF_ELITE_SCHEDULES; i++ )
            {
                crossoverPop.getSchedules().push( pop.getSchedules()[ i ] );
            }
            let i = NUMB_OF_ELITE_SCHEDULES;
            while ( i < POPULATION_SIZE )
            {
                const schedule1 = this._select_tournament_population( pop ).getSchedules()[ 0 ];
                const schedule2 = this._select_tournament_population( pop ).getSchedules()[ 0 ];
                crossoverPop.getSchedules().push( this._crossover_schedule( schedule1, schedule2 ) );
                i++;
            }
            return crossoverPop;
        }

        _mutate_population ( population )
        {
            for ( let i = NUMB_OF_ELITE_SCHEDULES; i < POPULATION_SIZE; i++ )
            {
                this._mutate_schedule( population.getSchedules()[ i ] );
            }
            return population;
        }

        _crossover_schedule ( schedule1, schedule2 )
        {
            const crossoverSchedule = new Schedule().initialize();
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

        _mutate_schedule ( mutateSchedule )
        {
            const schedule = new Schedule().initialize();
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
            const tournamentPop = new Population( 0 );
            let i = 0;
            while ( i < TOURNAMENT_SELECTION_SIZE )
            {
                tournamentPop.getSchedules().push( pop.getSchedules()[ Math.floor( Math.random() * POPULATION_SIZE ) ] );
                i++;
            }
            tournamentPop.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            return tournamentPop;
        }
    }

    function timetable ()
    {
        let schedule = [];
        let population = new Population( POPULATION_SIZE );
        let generationNum = 0;
        // CHECK LATER
        population.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
        let geneticAlgorithm = new GeneticAlgorithm();
        while ( population.getSchedules()[ 0 ].getFitness() !== 1.0 )
        {
            generationNum++;
            console.log( '\n> Generation #' + generationNum );
            population = geneticAlgorithm.evolve( population );
            population.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            schedule = population.getSchedules()[ 0 ].getClasses();
        }
        return schedule
    }
    const data = new Data();
    await data.fetchData();
    //console.log( timetable() );
} )

export
{
    getSchedule
}
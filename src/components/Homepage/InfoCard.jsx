export const InfoCard =  ({name,image}) =>{
    return(
        <div className="border rounded-md h-72 w-56 bg-gray-400">
            <div className="h-1/6 flex justify-center items-center text-xl text-white">{name}</div>
            <div className="h-5/6">
                <img src={image} alt="name's image" className="h-full rounded-b-md"/>
            </div>
        </div>
    )
}

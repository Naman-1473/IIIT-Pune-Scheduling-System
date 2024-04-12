const Course = () => {
    const handleSubmit=()=>{

    }
    return (
          <div className="bg-white text-center p-4 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Enter Course Data</h1>
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <input type="text" placeholder="Course ID" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <div className="mb-4">
                      <input type="text" placeholder="Course Name" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                      ADD
                  </button>
              </form>
          </div>
    )
}

export default Course

const Timings = () => {
    const handleSubmit=()=>{

    }
    return (
          <div className="bg-white text-center p-4 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Enter New Timings</h1>
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <input type="time" placeholder="Enter Start Time" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <div className="mb-4">
                      <input type="time" placeholder="Enter End Time" className="w-full py-2 px-4 border rounded-lg" />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-700 transition duration-300">
                      ADD
                  </button>
              </form>
          </div>
    )
}

export default Timings

// import "./App.css";
// import axios from "axios"

// function App() {
//   return (
//     <>
//       <h1>Student Management System</h1>
//       <h2>Add Student</h2>

//       <input placeholder="Name" />

//       <br />
//       <br />

//       <input placeholder="Course" />

//       <br />
//       <br />

//       <input placeholder="Age" />

//       <br />
//       <br />

//       <button>Add Student</button>

//       <h2>Students</h2>

//       <p>No students yet .</p>
//     </>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}`

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null)

  const getStudents = () => {
    axios.get(`${API}/students`).then((response) => {
      setStudents(response.data);
    })
  }

  useEffect(() => {
    getStudents();

  }, []);

  const reset = () => {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null)
  }

  const handleSubmit = () => {
    const data = { name, course, age };

    if (editingId) {
      axios.put(`${API}/students/${editingId}`, data).then(() => {
        reset();
        getStudents();
      }).catch((error) => {
        console.log("Update error", error)
      });
    } else {
      axios.post(`${API}/students`, data).then(() => {
        reset();
        getStudents();
      }).catch((error) => {
        console.log("Create error", error)
      })
    }
  }

  const handleEdit = (student) => {
    setEditingId(student._id)
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  }

  const handleDelete = (id) => {
    axios.delete(`${API}/students/${id}`).then(() => {
      if (editingId === id) {
        reset()
      }
      getStudents()
    }).catch((error) => {
      console.log("Delete error: ", error);
    })
  }



  return (
    <div>
      <h1>Student Management System</h1>

      {/* <p>Connecting to the server ...</p> */}



      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

      <input placeholder="Input name" value={name} required onChange={(event) => setName(event.target.value)} />

      <br />

      <input placeholder="Input course" value={course} required onChange={(event) => setCourse(event.target.value)} />

      <br />

      <input placeholder="Input age" value={age} required onChange={(event) => setAge(event.target.value)} />

      <br />
      <button onClick={handleSubmit}>
        {editingId ? "Update Student" : "Add Student"}
      </button>

      {editingId && <button onClick={reset}>Cancel</button>}

      <h1>Students</h1>

      {students.length === 0 && <p>No recorded students</p>}

      {students.map((student) => (
        <div key={student.id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => handleEdit(student)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;

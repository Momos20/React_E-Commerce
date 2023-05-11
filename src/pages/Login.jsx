import React, { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import axios from 'axios';
import { Footer, Navbar } from "../components";

const Login = ({ onLogin }) => {
  const [message, setMessage] = useState('');
  const [userID, setUserID] = useState(null); // Agregar estado para almacenar el ID del usuario
  const navegate= useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('Email').trim();
    const password = formData.get('Password').trim();
  
    // Verificar si los campos están vacíos
    if (!email || !password) {
      setMessage('Email y contraseña son requeridos.');
      return;
    }
  
    try {
      // Realizar solicitud GET a la API REST
      const response = await axios.get('http://localhost:5000/registro');
  
      // Comparar los valores del correo y la contraseña con los datos obtenidos en la respuesta
      const user = response.data.find((user) => user.email === email && user.password === password);
  
      if (!user) {
        setMessage('Credenciales inválidas.');
        return;
      }
  
      setMessage('Inicio de sesión exitoso.');
      setUserID(user.id); // Guardar el ID del usuario en el estado userID
      onLogin(true); // Llamar a la función onLogin pasando true como parámetro
      
      // Almacenar el userID en el almacenamiento local
      localStorage.setItem('userID', user.id);
      
      navegate('/'); // Navegar al usuario a la página principal
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage('Ha ocurrido un error al iniciar sesión.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label htmlFor="Email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  name="Email"
                  placeholder="name@example.com"
                />
              </div>
              <div className="my-3">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password"
                  name="Password"
                  placeholder="Password"
                />
              </div>
              {message && <div className="my-3 alert alert-success">{message}</div>}

              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
import React, { createContext, useContext, useEffect, useState } from 'react';
import socket from 'socketInstance'; // Ajusta la ruta según tu estructura de archivos
import axiosInstance from 'axiosInstance'; // Ajusta la ruta según tu estructura de archivos

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(localStorage.getItem("token"))

  const removeUser = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  // Función para obtener el usuario actualizado desde el servidor y actualizar el contexto
  const updateUser = async (newUser, newToken) => {
    if(newUser) {
        localStorage.setItem("user", JSON.stringify(newUser))
        localStorage.setItem("token", newToken)
        setUser(newUser)
        setToken(newToken)
        console.log(newUser)
    } else {
        const prevUser = JSON.parse(localStorage.getItem("user"));
        const response = await axiosInstance().get(`users/id/${prevUser._id}`);
        const updatedUser = response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser);
    }
      try {
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  // Efecto para suscribirse al evento 'usersUpdate' cuando el componente se monta
  useEffect(() => {
    const handleUsersUpdate = async () => {
      await updateUser();
    };

    socket.on("usersUpdate", handleUsersUpdate);

    return () => {
      socket.off("usersUpdate", handleUsersUpdate);
    };
  }, []);

  // Efecto para inicializar el contexto de usuario desde localStorage cuando el componente se monta
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);


  return (
    <UserContext.Provider value={{ token, user, updateUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
